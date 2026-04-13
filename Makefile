# ECR設定 (dev)
ECR_REGISTRY := 381492258078.dkr.ecr.ap-northeast-1.amazonaws.com
ECR_REPOSITORY := eztest
IMAGE_NAME := falcon9-eztest
AWS_REGION := ap-northeast-1
AWS_PROFILE := falcon9-dev-eztest

# ECR設定 (production)
PRD_ECR_REGISTRY := 134129058297.dkr.ecr.ap-northeast-1.amazonaws.com
PRD_ECR_REPOSITORY := eztest
PRD_IMAGE_NAME := falcon9-eztest-prd
PRD_AWS_REGION := ap-northeast-1
PRD_IAM_ROLE := arn:aws:iam::134129058297:role/prd-eztest-task

# DB seed設定 (production)
PRD_BASTION_HOST := 3.114.137.37
PRD_BASTION_USER := ec2-user
PRD_RDS_ENDPOINT := prd-eztest.cluster-cewdccg32xs8.ap-northeast-1.rds.amazonaws.com
PRD_DB_USER := eztest
PRD_DB_NAME := eztest
PRD_LOCAL_PORT := 15432

# タイムスタンプ (YYYYMMDDHHmmss形式)
TIMESTAMP := $(shell date +%Y%m%d%H%M%S)

.PHONY: login build tag push deploy deploy-prd seed-prd

# ECRにログイン
login:
	aws ecr get-login-password --region $(AWS_REGION) --profile $(AWS_PROFILE) | docker login --username AWS --password-stdin $(ECR_REGISTRY)

# Dockerイメージをビルド
build:
	docker build --platform linux/amd64 -t $(IMAGE_NAME):$(TIMESTAMP) .
	@echo "Built image: $(IMAGE_NAME):$(TIMESTAMP)"

# イメージにタグ付け
tag:
	docker tag $(IMAGE_NAME):$(TIMESTAMP) $(ECR_REGISTRY)/$(ECR_REPOSITORY):$(TIMESTAMP)
	@echo "Tagged: $(ECR_REGISTRY)/$(ECR_REPOSITORY):$(TIMESTAMP)"

# ECRにプッシュ
push:
	docker push $(ECR_REGISTRY)/$(ECR_REPOSITORY):$(TIMESTAMP)
	@echo "Pushed: $(ECR_REGISTRY)/$(ECR_REPOSITORY):$(TIMESTAMP)"

# ビルドからプッシュまで一括実行
deploy: login
	$(eval TIMESTAMP := $(shell date +%Y%m%d%H%M%S))
	docker build --platform linux/amd64 -t $(IMAGE_NAME):$(TIMESTAMP) .
	docker tag $(IMAGE_NAME):$(TIMESTAMP) $(ECR_REGISTRY)/$(ECR_REPOSITORY):$(TIMESTAMP)
	docker push $(ECR_REGISTRY)/$(ECR_REPOSITORY):$(TIMESTAMP)
	@echo "=== Deploy completed ==="
	@echo "Image: $(ECR_REGISTRY)/$(ECR_REPOSITORY):$(TIMESTAMP)"

# 本番ビルドからプッシュまで一括実行 (IAM Role assume-role で認証)
deploy-prd:
	@echo "=== Assuming IAM role: $(PRD_IAM_ROLE) ==="
	@CREDS=$$(aws sts assume-role \
		--role-arn $(PRD_IAM_ROLE) \
		--role-session-name make-deploy-prd \
		--query 'Credentials' \
		--output json) && \
	export AWS_ACCESS_KEY_ID=$$(echo $$CREDS | jq -r '.AccessKeyId') && \
	export AWS_SECRET_ACCESS_KEY=$$(echo $$CREDS | jq -r '.SecretAccessKey') && \
	export AWS_SESSION_TOKEN=$$(echo $$CREDS | jq -r '.SessionToken') && \
	echo "=== Logging into ECR ===" && \
	aws ecr get-login-password --region $(PRD_AWS_REGION) | docker login --username AWS --password-stdin $(PRD_ECR_REGISTRY) && \
	echo "=== Building production image ===" && \
	TIMESTAMP=$$(date +%Y%m%d%H%M%S) && \
	docker build --platform linux/amd64 -t $(PRD_IMAGE_NAME):$$TIMESTAMP . && \
	docker tag $(PRD_IMAGE_NAME):$$TIMESTAMP $(PRD_ECR_REGISTRY)/$(PRD_ECR_REPOSITORY):$$TIMESTAMP && \
	echo "=== Pushing to ECR ===" && \
	docker push $(PRD_ECR_REGISTRY)/$(PRD_ECR_REPOSITORY):$$TIMESTAMP && \
	echo "=== Production deploy completed ===" && \
	echo "Image: $(PRD_ECR_REGISTRY)/$(PRD_ECR_REPOSITORY):$$TIMESTAMP"

# 本番RDSにbastion経由でシードを実行
# 使い方: make seed-prd PEM=/path/to/key.pem DB_PASSWORD=yourpassword
seed-prd:
	@if [ -z "$(PEM)" ]; then echo "Error: PEM=/path/to/key.pem を指定してください"; exit 1; fi
	@if [ -z "$(DB_PASSWORD)" ]; then echo "Error: DB_PASSWORD=yourpassword を指定してください"; exit 1; fi
	@echo "=== SSHポートフォワーディングを開始 ==="
	@ssh -N -f -L $(PRD_LOCAL_PORT):$(PRD_RDS_ENDPOINT):5432 \
		-i $(PEM) \
		-o StrictHostKeyChecking=no \
		-o ExitOnForwardFailure=yes \
		$(PRD_BASTION_USER)@$(PRD_BASTION_HOST)
	@echo "=== Prisma seed を実行 ==="
	@DATABASE_URL="postgresql://$(PRD_DB_USER):$(DB_PASSWORD)@localhost:$(PRD_LOCAL_PORT)/$(PRD_DB_NAME)" \
		ADMIN_EMAIL="$(ADMIN_EMAIL)" \
		ADMIN_PASSWORD="$(ADMIN_PASSWORD)" \
		ADMIN_NAME="$(ADMIN_NAME)" \
		npx prisma db seed; \
	EXIT_CODE=$$?; \
	SSH_PID=$$(lsof -ti TCP:$(PRD_LOCAL_PORT) -s TCP:LISTEN); \
	if [ -n "$$SSH_PID" ]; then kill $$SSH_PID; fi; \
	echo "=== SSHトンネルを終了 ==="; \
	exit $$EXIT_CODE

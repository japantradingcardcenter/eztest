'use client';

import { SearchInput } from '@/frontend/reusable-elements/inputs/SearchInput';
import { FilterDropdown, type FilterOption } from '@/frontend/reusable-components/inputs/FilterDropdown';
import { TestRunFilters } from '../types';
import { useDropdownOptions } from '@/hooks/useDropdownOptions';

interface TestRunsFilterCardProps {
  filters: TestRunFilters;
  onSearchChange: (search: string) => void;
  onStatusFilterChange: (status: string) => void;
  onEnvironmentFilterChange: (environment: string) => void;
  onPlatformFilterChange: (platform: string) => void;
  onDeviceFilterChange: (device: string) => void;
}

export function TestRunsFilterCard({
  filters,
  onSearchChange,
  onStatusFilterChange,
  onEnvironmentFilterChange,
  onPlatformFilterChange,
  onDeviceFilterChange,
}: TestRunsFilterCardProps) {
  // Fetch dynamic dropdown options
  const { options: statusOptionsData } = useDropdownOptions('TestRun', 'status');
  const { options: environmentOptionsData } = useDropdownOptions('TestRun', 'environment');

  // Map to FilterOption format with "All" option
  const statusOptions: FilterOption[] = [
    { value: 'all', label: 'すべてのステータス' },
    ...statusOptionsData.map(opt => ({ value: opt.value, label: opt.label })),
  ];

  const environmentOptions: FilterOption[] = [
    { value: 'all', label: 'すべての環境' },
    ...environmentOptionsData.map(opt => ({ value: opt.value, label: opt.label })),
  ];

  const platformOptions: FilterOption[] = [
    { value: 'all', label: 'すべてのプラットフォーム' },
    { value: 'Web', label: 'Web' },
    { value: 'Web(SP)', label: 'Web(SP)' },
    { value: 'iOS Native', label: 'iOS Native' },
    { value: 'Android Native', label: 'Android Native' },
  ];

  const deviceOptions: FilterOption[] = [
    { value: 'all', label: 'すべての端末' },
    { value: 'iPhone', label: 'iPhone' },
    { value: 'Android', label: 'Android' },
    { value: 'PC', label: 'PC' },
  ];

  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="md:col-span-2">
          <SearchInput
            value={filters.searchQuery}
            onChange={onSearchChange}
            placeholder="テストランを検索..."
          />
        </div>

        <div>
          <FilterDropdown
            value={filters.statusFilter}
            onValueChange={onStatusFilterChange}
            placeholder="ステータス"
            options={statusOptions}
          />
        </div>

        <div>
          <FilterDropdown
            value={filters.environmentFilter}
            onValueChange={onEnvironmentFilterChange}
            placeholder="環境"
            options={environmentOptions}
          />
        </div>

        <div>
          <FilterDropdown
            value={filters.platformFilter}
            onValueChange={onPlatformFilterChange}
            placeholder="プラットフォーム"
            options={platformOptions}
          />
        </div>

        <div>
          <FilterDropdown
            value={filters.deviceFilter}
            onValueChange={onDeviceFilterChange}
            placeholder="端末"
            options={deviceOptions}
          />
        </div>
      </div>
    </div>
  );
}

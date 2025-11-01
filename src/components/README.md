# Components

This directory contains all reusable components for the application.

## Structure

```
components/
├── restyled/        # Restyled Ant Design components
│   ├── Button/
│   ├── Input/
│   ├── Select/
│   ├── Table/
│   └── Checkbox/
└── custom/          # Custom components built from scratch
```

## Restyled Components

These components wrap Ant Design components with custom styling using the Geist font and a consistent design system.

### Usage

```tsx
// Import from the main components folder
import { Button, Input, Select, Table, Checkbox } from '@/components';

// Or import directly from restyled
import { Button } from '@/components/restyled';
```

### Available Components

#### Button

```tsx
<Button type="primary" onClick={handleClick}>
  Click Me
</Button>
```

#### Input

```tsx
<Input placeholder="Enter text..." />
<Input.Password placeholder="Enter password..." />
<Input.TextArea placeholder="Enter description..." rows={4} />
```

#### Select

```tsx
<Select
  placeholder="Select option"
  options={[
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
  ]}
/>
```

#### Table

```tsx
<Table
  columns={columns}
  dataSource={data}
  rowKey="id"
  pagination={{ pageSize: 10 }}
/>
```

#### Checkbox

```tsx
<Checkbox>Remember me</Checkbox>
<Checkbox.Group options={options} />
```

## Design System

All components use:

- **Font**: Geist (loaded globally)
- **Primary Color**: #0070f3
- **Border Radius**: 8px (buttons, inputs), 12px (cards, tables)
- **Transitions**: cubic-bezier(0.4, 0, 0.2, 1)

## Custom Components

Place your custom components in the `custom/` folder with the same structure:

```
custom/
└── YourComponent/
    ├── index.tsx
    └── YourComponent.module.css
```

Then export them from `custom/index.ts`:

```tsx
export { YourComponent } from './YourComponent';
export type { YourComponentProps } from './YourComponent';
```

## Theme Configuration

The global theme is configured in `src/config/theme.ts` and applied via Ant Design's ConfigProvider in `main.tsx`.

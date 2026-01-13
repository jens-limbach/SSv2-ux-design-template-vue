# CSS Style Guide: SAP Sales and Service Cloud V2 Design System

This guide documents the CSS styling used in this Vue.js application, based on the SAP Sales and Service Cloud Version 2 design system (SAP Horizon). These styles can be reused in pure HTML pages or any JavaScript framework.

---

## 🚀 Interactive CSS Showcase (NEW!)

**Want to see live examples with copy-able code?**

👉 **[Open Interactive CSS Showcase](/css-showcase.html)** 👈

The showcase page provides:
- ✨ **Live interactive examples** for every component
- 📋 **Copy-to-clipboard** code snippets
- 🎨 **Color swatches** with variable names
- 🔘 **All button variants** and sizes
- 📊 **Table examples** with row states
- 🏷️ **Badges, filters, icons, pagination**
- 📱 **Modal dialogs** and form layouts
- 🌐 **Framework-agnostic** HTML + CSS only

Access it from the main application by clicking the **"CSS Guide"** button in the header, or navigate directly to `/css-showcase.html`.

This documentation below provides detailed technical reference, while the showcase gives you instant visual examples you can copy and use.

---

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Color System](#color-system)
3. [Global Styles](#global-styles)
4. [Component Styles](#component-styles)
5. [Tables](#tables)
6. [Buttons](#buttons)
7. [Input Fields](#input-fields)
8. [Form Controls](#form-controls)
9. [Icons](#icons)
10. [Badges](#badges)
11. [Column Filters](#column-filters)
12. [Usage Examples](#usage-examples)

---

## Architecture Overview

The CSS is organized into three separate files following a modular approach:

### 1. **`sap-crm-colors.css`** - Color Variables
- Defines all color custom properties (CSS variables)
- No actual styling, only color definitions
- ~400 lines of color variables

### 2. **`sap-crm-global.css`** - Global Styles & Resets
- CSS reset and base styles
- Typography definitions
- Font family and sizing
- Body and HTML base styles
- ~340 lines

### 3. **`sap-crm-components.css`** - UI Components
- All component-specific styles
- Tables, buttons, inputs, form controls
- Component states (hover, active, disabled, focus)
- ~3200 lines

**Import Order (Important!):**
```html
<link rel="stylesheet" href="sap-crm-colors.css">
<link rel="stylesheet" href="sap-crm-global.css">
<link rel="stylesheet" href="sap-crm-components.css">
```

---

## Color System

All colors are defined as CSS custom properties in `:root`. **Never hardcode colors** - always use the variables.

### Primary Colors
```css
--color-primary-1: #dcf3ff      /* Lightest blue */
--color-primary-2: #d1efff
--color-primary-3: #89d1ff
--color-primary-4: #0070f2      /* SAP Blue (main) */
--color-primary-5: #0064d9
--color-primary-6: #0058bf      /* Darkest blue */
```

**Usage:**
```css
.my-button {
  background-color: var(--color-primary-4);  /* SAP Blue */
  border-color: var(--color-primary-5);      /* Darker shade */
}
```

### Neutral Colors
```css
--color-neutral-1: #eff1f2      /* Lightest gray */
--color-neutral-2: #eaecee
--color-neutral-3: #a8b3bd
--color-neutral-4: #556b82
--color-neutral-5: #475e75
--color-neutral-6: #354a5f
--color-neutral-7: #1d2d3e      /* Darkest gray (text) */
```

### Semantic Colors

#### Success (Green)
```css
--color-accent-green-1: #f5fae5
--color-accent-green-4: #188918  /* Main success color */
--color-accent-green-6: #164323
```

#### Error (Red)
```css
--color-accent-red-1: #ffeaf4
--color-accent-red-4: #d20a0a    /* Main error color */
--color-accent-red-6: #5a0404
```

#### Warning (Yellow/Orange)
```css
--color-accent-yellow-3: #ffb727
--color-accent-orange-4: #c35500
```

#### Info (Blue)
```css
--color-accent-blue-4: #005fb8   /* Info messages */
```

### Background Colors
```css
--color-background-white: #fff
--color-background-normal: #f5f6f7
--color-background-faded: #f7f8f9
```

**Usage Example:**
```html
<div style="background-color: var(--color-background-normal);">
  Content with gray background
</div>
```

---

## Global Styles

### Typography

**Font Family:**
```css
font-family: "72", Helvetica, -apple-system, Arial, sans-serif;
```

**Font Sizes:**
```css
--font-size-small: 0.75rem     /* 12px */
--font-size-normal: 0.875rem   /* 14px - default */
--font-size-medium: 1rem       /* 16px */
--font-size-large: 1.125rem    /* 18px */
--font-size-xlarge: 1.5rem     /* 24px */
```

**Font Weights:**
```css
font-weight: 400;   /* Regular */
font-weight: 500;   /* Medium */
font-weight: 700;   /* Bold */
```

**Line Heights:**
```css
line-height: 1.4;   /* Body text */
line-height: 1.5;   /* Standard */
line-height: 1.2;   /* Headings */
```

### Spacing System (8px Grid)

Use multiples of 0.5rem (8px):
```css
--spacing-xs: 0.25rem    /* 4px */
--spacing-sm: 0.5rem     /* 8px */
--spacing-md: 0.75rem    /* 12px */
--spacing-lg: 1rem       /* 16px */
--spacing-xl: 1.5rem     /* 24px */
--spacing-xxl: 2rem      /* 32px */
```

---

## Component Styles

### BEM Naming Convention

All components follow BEM (Block Element Modifier) naming:

```
.sap-crm-{component}                 /* Block */
.sap-crm-{component}__{element}      /* Element */
.sap-crm-{component}--{modifier}     /* Modifier */
```

**Examples:**
```css
.sap-crm-btn                    /* Button block */
.sap-crm-btn--primary          /* Primary button modifier */
.sap-crm-table__cell           /* Table cell element */
.sap-crm-table__cell--header   /* Header cell modifier */
```

---

## Tables

### Basic Table Structure

```html
<div class="sap-crm-table--wrapper">
  <table class="sap-crm-table">
    <thead>
      <tr class="sap-crm-table__row">
        <th class="sap-crm-table__cell sap-crm-table__cell--header">Name</th>
        <th class="sap-crm-table__cell sap-crm-table__cell--header">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr class="sap-crm-table__row">
        <td class="sap-crm-table__cell">John Doe</td>
        <td class="sap-crm-table__cell">Active</td>
      </tr>
    </tbody>
  </table>
</div>
```

### Table Classes

#### Core Classes
```css
.sap-crm-table                  /* Base table */
.sap-crm-table--wrapper         /* Scrollable container */
.sap-crm-table__row             /* Table row */
.sap-crm-table__cell            /* Table cell */
.sap-crm-table__cell--header    /* Header cell */
```

#### Row States
```css
.sap-crm-table__row--selected   /* Selected row (light blue bg) */
.sap-crm-table__row--disabled   /* Disabled row (reduced opacity) */
.sap-crm-table__row--busy       /* Loading row */
```

**Example - Selected Row:**
```html
<tr class="sap-crm-table__row sap-crm-table__row--selected">
  <td class="sap-crm-table__cell">Selected Item</td>
</tr>
```

#### Row Status Indicators

Visual left border indicators:

```html
<tr class="sap-crm-table__row">
  <td class="sap-crm-table__cell">
    <div class="sap-crm-table__state sap-crm-table__state--success"></div>
    Active Account
  </td>
</tr>
```

**Status Classes:**
```css
.sap-crm-table__state--success   /* Green bar */
.sap-crm-table__state--error     /* Red bar */
.sap-crm-table__state--caution   /* Orange bar */
.sap-crm-table__state--info      /* Blue bar */
```

#### Cell Properties

```css
.sap-crm-table__cell {
  height: 3rem;              /* Standard row height */
  font-weight: 500;
  color: var(--color-neutral-7);
  background: var(--color-background-white);
  border-bottom: 0.0625rem solid var(--color-neutral-2);
  padding: 0.75rem 1rem;
  text-align: left;
  vertical-align: middle;
}
```

**Header cells:**
```css
.sap-crm-table__cell--header {
  color: var(--color-neutral-5);
  font-weight: 700;
  position: sticky;
  top: 0;
  z-index: 2;
}
```

### Table Hover Effects

Automatic hover background on rows:
```css
.sap-crm-table__row:not(.sap-crm-table__row--selected):hover > :not(.sap-crm-table__cell--header) {
  background: var(--color-neutral-1);  /* Light gray on hover */
}
```

---

## Buttons

### Button Variants

```html
<!-- Primary Button (Blue, filled) -->
<button class="sap-crm-btn sap-crm-btn--primary">Save</button>

<!-- Secondary Button (White with border) -->
<button class="sap-crm-btn sap-crm-btn--secondary">Cancel</button>

<!-- Neutral Light Button -->
<button class="sap-crm-btn sap-crm-btn--neutrallight">Edit</button>

<!-- Icon Only Button -->
<button class="sap-crm-btn sap-crm-btn--md sap-crm-btn--md--icon_only">
  <svg>...</svg>
</button>
```

### Button Sizes

```css
.sap-crm-btn--xsm     /* Extra small (minimal padding) */
.sap-crm-btn--sm      /* Small (2rem height) */
.sap-crm-btn--md      /* Medium (2.25rem height) - default */
.sap-crm-btn--lg      /* Large (2.75rem height) */
```

**Example:**
```html
<button class="sap-crm-btn sap-crm-btn--primary sap-crm-btn--sm">
  Small Button
</button>
```

### Button States

#### Base Button Styles
```css
.sap-crm-btn {
  font-family: "72", Helvetica, -apple-system, Arial, sans-serif;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-neutral-5);
  background: transparent;
  border: 0.0625rem solid transparent;
  border-radius: 0.5rem;
  padding: 0.4375rem 1rem;
  transition: all 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

#### Hover State
```css
.sap-crm-btn:hover:enabled {
  cursor: pointer;
  color: var(--color-primary-6);
}
```

#### Disabled State
```css
.sap-crm-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

#### Focus State (Accessibility)
```css
.sap-crm-btn:focus-visible {
  box-shadow: 0 0 0 0.125rem var(--color-primary-4);
  z-index: 2;
}
```

### Button Variants

#### Primary Button
```css
.sap-crm-btn--primary {
  color: var(--color-background-white);
  background: var(--color-primary-4);
  border-color: transparent;
}

.sap-crm-btn--primary:hover:enabled {
  background: var(--color-primary-5);  /* Darker on hover */
}
```

#### Neutral Light Button
```css
.sap-crm-btn--neutrallight {
  color: var(--color-neutral-5);
}

.sap-crm-btn--neutrallight:hover:enabled {
  background: var(--color-background-white);
  border: 1px solid var(--color-neutral-3);
}
```

### Toggle Buttons (for Priority, etc.)

```html
<button class="sap-crm-btn sap-crm-btn--toggle sap-crm-btn--toggle--red">
  High
</button>
<button class="sap-crm-btn sap-crm-btn--toggle sap-crm-btn--toggle--yellow">
  Medium
</button>
<button class="sap-crm-btn sap-crm-btn--toggle sap-crm-btn--toggle--blue">
  Low
</button>
```

**Toggle variants:**
```css
.sap-crm-btn--toggle--red       /* Red background for high priority */
.sap-crm-btn--toggle--yellow    /* Yellow for medium priority */
.sap-crm-btn--toggle--blue      /* Blue for low priority */
.sap-crm-btn--toggle--green     /* Green for success */
.sap-crm-btn--toggle--primary   /* Primary blue */
```

**Active toggle (selected):**
```css
.sap-crm-btn--toggle--primary {
  color: var(--color-primary-5);
  background: var(--color-primary-1);
  border-color: var(--color-primary-5);
  border-style: solid;
}
```

---

## Input Fields

### Basic Input Structure

```html
<div class="sap-crm-input">
  <input type="text" placeholder="Enter text...">
</div>
```

### Input Styles

```css
.sap-crm-input {
  position: relative;
}

.sap-crm-input input {
  width: 100%;
  font-family: "72", Helvetica, -apple-system, Arial, sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  color: var(--color-neutral-7);
  background: var(--color-background-white);
  border: 0.0625rem solid var(--color-neutral-4);
  border-radius: 0.25rem;
  padding: 0.5rem 0.75rem;
  height: 2.25rem;
  line-height: 1.25rem;
}
```

### Input States

#### Focus State
```css
.sap-crm-input input:focus {
  outline: none;
  border-color: var(--color-primary-4);
  box-shadow: 0 0 0 0.125rem var(--color-primary-4);
}
```

#### Hover State
```css
.sap-crm-input input:hover {
  border-color: var(--color-primary-5);
}
```

#### Disabled State
```css
.sap-crm-input input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: var(--color-background-faded);
}
```

#### Error State
```html
<div class="sap-crm-input sap-crm-input--error">
  <input type="text" value="Invalid input">
</div>
```

```css
.sap-crm-input--error input {
  border: 1px solid var(--color-accent-red-3);
  background-color: var(--color-accent-red-2);
}
```

### Textarea

```html
<div class="sap-crm-input sap-crm-input--textarea">
  <textarea rows="4" placeholder="Enter description..."></textarea>
</div>
```

```css
.sap-crm-input textarea {
  min-height: 5rem;
  resize: vertical;
  padding: 0.75rem;
}
```

### Input with Icon

```html
<div class="sap-crm-input sap-crm-input--spaceleft">
  <svg class="sap-crm-input__icon sap-crm-icon sap-crm-icon--sm">
    <!-- Search icon -->
  </svg>
  <input type="text" placeholder="Search..." style="padding-left: 2.5rem;">
</div>
```

```css
.sap-crm-input__icon {
  color: var(--color-neutral-5);
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
}
```

---

## Form Controls

### Checkbox

```html
<div class="sap-crm-icontrol sap-crm-icontrol__checkbox">
  <input type="checkbox" id="myCheckbox">
  <div class="sap-crm-icontrol__wrap sap-crm-icontrol__wrap--checkbox">
    <svg class="sap-crm-icontrol__icon" width="20" height="20" viewBox="0 0 20 20">
      <path d="M7 10l2 2 4-4" stroke="currentColor" stroke-width="2" fill="none"/>
    </svg>
  </div>
</div>
<label for="myCheckbox">Accept terms</label>
```

### Radio Button

```html
<div class="sap-crm-icontrol sap-crm-icontrol__radio">
  <input type="radio" name="group" id="option1" value="1" checked>
  <div class="sap-crm-icontrol__wrap sap-crm-icontrol__wrap--radio"></div>
</div>
<label for="option1">Option 1</label>
```

### Toggle Switch

```html
<div class="sap-crm-icontrol sap-crm-icontrol__switch">
  <input type="checkbox" id="mySwitch" checked>
  <div class="sap-crm-icontrol__wrap sap-crm-icontrol__wrap--switch">
    <div class="sap-crm-icontrol__icon"></div>
  </div>
</div>
<label for="mySwitch">Enable notifications</label>
```

### Form Control Styles

#### Base Control
```css
.sap-crm-icontrol {
  width: 1.25rem;
  height: 1.25rem;
  display: inline-block;
  position: relative;
  flex: 0 0 auto;
}

.sap-crm-icontrol input {
  margin: 0;
  opacity: 0;
  cursor: pointer;
  position: absolute;
  width: 1.25rem;
  height: 1.25rem;
}
```

#### Checkbox Wrapper
```css
.sap-crm-icontrol__wrap--checkbox {
  border: 0.125rem solid var(--color-neutral-4);
  border-radius: 0.25rem;
  background-color: var(--color-background-white);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

#### Checked State
```css
.sap-crm-icontrol__checkbox input:checked + .sap-crm-icontrol__wrap {
  transform: rotate(90deg);
}

.sap-crm-icontrol__checkbox input:checked + .sap-crm-icontrol__wrap .sap-crm-icontrol__icon {
  opacity: 1;
  transform: scale(1) rotate(-90deg);
  color: var(--color-primary-5);
}
```

#### Switch Styles
```css
.sap-crm-icontrol__wrap--switch {
  width: 2rem;
  height: 1.125rem;
  border-radius: 100rem;
  background-color: var(--color-neutral-4);
}

.sap-crm-icontrol__switch input:checked + .sap-crm-icontrol__wrap {
  background: var(--color-accent-blue-4);
}

.sap-crm-icontrol__switch .sap-crm-icontrol__icon {
  width: 1.125rem;
  height: 0.875rem;
  background: var(--color-background-white);
  border-radius: 0.5rem;
  transition: transform 0.1s;
}

.sap-crm-icontrol__switch input:checked + .sap-crm-icontrol__wrap .sap-crm-icontrol__icon {
  transform: translateX(0.75rem);
}
```

---

## Icons

### Icon Sizes

```html
<!-- Small Icon (16px) -->
<svg class="sap-crm-icon sap-crm-icon--sm">...</svg>

<!-- Medium Icon (20px) -->
<svg class="sap-crm-icon sap-crm-icon--md">...</svg>

<!-- Large Icon (24px / 28px) -->
<svg class="sap-crm-icon sap-crm-icon--lg">...</svg>
```

### Icon Styles

```css
.sap-crm-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  outline: none;
}

.sap-crm-icon svg {
  width: 100%;
  height: 100%;
  fill: currentColor;  /* Inherits text color */
}

.sap-crm-icon--sm {
  width: 1rem;      /* 16px */
  height: 1rem;
}

.sap-crm-icon--md {
  width: 1.25rem;   /* 20px */
  height: 1.25rem;
}

.sap-crm-icon--lg {
  width: 1.75rem;   /* 28px */
  height: 1.75rem;
}
```

**Usage Example:**
```html
<button class="sap-crm-btn sap-crm-btn--primary">
  <svg class="sap-crm-icon sap-crm-icon--sm" viewBox="0 0 16 16">
    <path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="2"/>
  </svg>
  Add New
</button>
```

---

## SVG Icon Library

The application includes a comprehensive set of SVG icons optimized for the SAP design system. All icons are 24x24 viewBox with consistent stroke widths and fill patterns.

**Note on Icon Colors in Documentation:**
- In **actual implementation**, icons use `fill="currentColor"` to inherit the text color from their parent element or CSS styling.
- In the **code examples below**, icons include an explicit `fill="#0070F2"` (SAP blue) attribute.
- **GitHub Markdown Limitation**: Inline SVG elements are not rendered in GitHub's markdown for security reasons, so you won't see visual previews here. The SVGs will render properly when used in your HTML/Vue application.
- When using these icons in your application, you can keep `fill="currentColor"` and control the color via CSS, or use explicit fill colors as needed.

### Available Icons

#### Search Icon
**Type:** `search` | **Usage:** Search functionality, search buttons, search inputs

```html
<svg class="sap-crm-icon sap-crm-icon--md" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" role="img" aria-label="search">
  <path fill="#0070F2" d="M10.8889012,2 C15.7981303,2 19.7778025,5.97969442 19.7778025,10.8889012 C19.7778025,12.9430885 19.0810143,14.8345226 17.9108962,16.3397453 L21.6745829,20.1032474 C22.1084724,20.5371369 22.1084724,21.2406934 21.6745829,21.6745829 C21.2406934,22.1084724 20.5371369,22.1084724 20.1032474,21.6745829 L16.3397453,17.9108962 C14.8345226,19.0810143 12.9430885,19.7778025 10.8889012,19.7778025 C5.97969442,19.7778025 2,15.7981303 2,10.8889012 C2,5.97969442 5.97969442,2 10.8889012,2 Z M10.8889012,4.22222531 C7.20699612,4.22222531 4.22222531,7.20699612 4.22222531,10.8889012 C4.22222531,14.5707952 7.20699612,17.5555772 10.8889012,17.5555772 C14.5707952,17.5555772 17.5555772,14.5707952 17.5555772,10.8889012 C17.5555772,7.20699612 14.5707952,4.22222531 10.8889012,4.22222531 Z" />
</svg>
```

#### Plus Icon
**Type:** `plus` | **Usage:** Add buttons, create new records, expand sections

```html
<svg class="sap-crm-icon sap-crm-icon--md" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" role="img" aria-label="plus">
  <path fill="#0070F2" d="M12,4 C12.5523,4 13,4.51168 13,5.14285714 L13,11 L18.8571429,11 C19.4883429,11 20,11.4477 20,12 C20,12.5523 19.4883429,13 18.8571429,13 L13,13 L13,18.8571429 C13,19.4883429 12.5523,20 12,20 C11.4477,20 11,19.4883429 11,18.8571429 L11,13 L5.14285714,13 C4.51168,13 4,12.5523 4,12 C4,11.4477 4.51168,11 5.14285714,11 L11,11 L11,5.14285714 C11,4.51168 11.4477,4 12,4 Z" />
</svg>
```

#### Close Icon
**Type:** `close` | **Usage:** Close dialogs, dismiss notifications, clear inputs

```html
<svg class="sap-crm-icon sap-crm-icon--md" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" role="img" aria-label="close">
  <path fill="#0070F2" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
</svg>
```

#### Trash Icon
**Type:** `trash` | **Usage:** Delete actions, remove items

```html
<svg class="sap-crm-icon sap-crm-icon--md" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" role="img" aria-label="trash">
  <path fill="#0070F2" d="M14.0046,2 C15.6615,2 17.0046,3.34315 17.0046,5 L17.004,6 L20,6 C20.5523,6 21,6.44772 21,7 C21,7.55228 20.5523,8 20,8 L19,8 L19,19 C19,20.6569 17.6569,22 16,22 L8,22 C6.34315,22 5,20.6569 5,19 L5,8 L4,8 C3.44772,8 3,7.55228 3,7 C3,6.44772 3.44772,6 4,6 L6.999,6 L7,5 C7,3.34315 8.34315,2 10,2 L14.0046,2 Z M17,8 L7,8 L7,19 C7,19.5523 7.44772,20 8,20 L16,20 C16.5523,20 17,19.5523 17,19 L17,8 Z M10,10 C10.5523,10 11,10.4477 11,11 L11,17 C11,17.5523 10.5523,18 10,18 C9.44772,18 9,17.5523 9,17 L9,11 C9,10.4477 9.44772,10 10,10 Z M14,10 C14.5523,10 15,10.4477 15,11 L15,17 C15,17.5523 14.5523,18 14,18 C13.4477,18 13,17.5523 13,17 L13,11 C13,10.4477 13.4477,10 14,10 Z M14.0046,4 L10,4 C9.44772,4 9,4.44772 9,5 L8.999,6 L15.004,6 L15.0046,5 C15.0046,4.44772 14.5569,4 14.0046,4 Z" />
</svg>
```

#### Analytics Icon
**Type:** `analytics` | **Usage:** Analytics panels, charts, reporting features

```html
<svg class="sap-crm-icon sap-crm-icon--md" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" role="img" aria-label="analytics">
  <path fill="#0070F2" d="M12 2a1 1 0 011 1v18a1 1 0 11-2 0V3a1 1 0 011-1z M20.94 8.649a1 1 0 01-.585 1.287l-8.004 3a1 1 0 01-.702-1.872l8.004-3a1 1 0 011.287.585z M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12zm10-8a8 8 0 100 16 8 8 0 000-16z" />
</svg>
```

#### Unsorted Icon
**Type:** `unsorted` | **Usage:** Table column headers (default state), sortable indicators

```html
<svg class="sap-crm-icon sap-crm-icon--sm" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" role="img" aria-label="unsorted">
  <path fill="#0070F2" d="M9.037 9.517 12 5.9l2.963 3.617H9.037Zm-2.117.267c-.395.483-.058 1.216.56 1.216h9.04c.618 0 .955-.733.56-1.216l-4.52-5.517a.721.721 0 0 0-1.12 0L6.92 9.783ZM12 18.1l2.963-3.617H9.037L12 18.1Zm-5.08-3.884C6.525 13.733 6.862 13 7.48 13h9.04c.618 0 .955.733.56 1.216l-4.52 5.517a.721.721 0 0 1-1.12 0l-4.52-5.517Z" />
</svg>
```

#### Ascending Icon
**Type:** `ascending` | **Usage:** Table sorting (ascending order)

```html
<svg class="sap-crm-icon sap-crm-icon--sm" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" role="img" aria-label="ascending">
  <path fill="#0070F2" d="M6.92 9.784c-.395.483-.058 1.216.56 1.216h9.04c.618 0 .955-.733.56-1.216l-4.52-5.517a.721.721 0 0 0-1.12 0L6.92 9.783ZM12 18.1l2.963-3.617H9.037L12 18.1Zm-5.08-3.884C6.525 13.733 6.862 13 7.48 13h9.04c.618 0 .955.733.56 1.216l-4.52 5.517a.721.721 0 0 1-1.12 0l-4.52-5.517Z" />
</svg>
```

#### Descending Icon
**Type:** `descending` | **Usage:** Table sorting (descending order)

```html
<svg class="sap-crm-icon sap-crm-icon--sm" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" role="img" aria-label="descending">
  <path fill="#0070F2" d="M9.037 9.517 12 5.9l2.963 3.617H9.037Zm-2.117.267c-.395.483-.058 1.216.56 1.216h9.04c.618 0 .955-.733.56-1.216l-4.52-5.517a.721.721 0 0 0-1.12 0L6.92 9.783Zm0 4.432C6.525 13.733 6.862 13 7.48 13h9.04c.618 0 .955.733.56 1.216l-4.52 5.517a.721.721 0 0 1-1.12 0l-4.52-5.517Z" />
</svg>
```

#### Edit Icon
**Type:** `edit` | **Usage:** Edit buttons, modify actions

```html
<svg class="sap-crm-icon sap-crm-icon--md" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" role="img" aria-label="edit">
  <path fill="#0070F2" d="M16.2929,3.29289 C16.6834,2.90237 17.3166,2.90237 17.7071,3.29289 L17.7071,3.29289 L20.7071,6.29289 C21.0976,6.68342 21.0976,7.31658 20.7071,7.70711 L20.7071,7.70711 L17.7068,10.7074 L7.70711,20.7071 C7.51957,20.8946 7.26522,21 7,21 L7,21 L4,21 C3.44772,21 3,20.5523 3,20 L3,20 L3,17 C3,16.7348 3.10536,16.4804 3.29289,16.2929 L3.29289,16.2929 L13.293,6.29279 Z M14,8.41421 L5.41421,17 L7,18.5858 L15.5858,10 L14,8.41421 Z M17,5.41421 L15.4142,7 L17,8.58579 L18.5858,7 L17,5.41421 Z" />
</svg>
```

#### Open Page Icon
**Type:** `open-page` | **Usage:** External links, open in new window/tab

```html
<svg class="sap-crm-icon sap-crm-icon--md" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" role="img" aria-label="open-page">
  <path fill="#0070F2" d="M10.0037,3 C10.5559,3 11.0037,3.44772 11.0037,4 C11.0037,4.55228 10.5559,5 10.0037,5 L6,5 C5.44772,5 5,5.44772 5,6 L5,18 C5,18.5523 5.44772,19 6,19 L18.0037,19 C18.5559,19 19.0037,18.5523 19.0037,18 L19.0037,14 C19.0037,13.4477 19.4514,13 20.0037,13 C20.5559,13 21.0037,13.4477 21.0037,14 L21.0037,18 C21.0037,19.6569 19.6605,21 18.0037,21 L6,21 C4.34315,21 3,19.6569 3,18 L3,6 C3,4.34315 4.34315,3 6,3 L10.0037,3 Z M20,3 L20.0193547,3.00018615 C20.0426815,3.00063489 20.0659956,3.00189496 20.089251,3.00396636 L20,3 C20.0506217,3 20.1003646,3.00376123 20.1489647,3.01101945 C20.1659506,3.01362793 20.183377,3.01670199 20.2007276,3.02023985 C20.2227508,3.02464003 20.2444415,3.02983391 20.2658449,3.0357213 C20.2814655,3.04009729 20.2968536,3.04472822 20.3121448,3.04973754 C20.3318037,3.05612298 20.3515854,3.06331629 20.3710648,3.07110458 C20.3887978,3.07819556 20.4061005,3.08567811 20.4232234,3.09367233 C20.4438981,3.10337749 20.4643007,3.11379483 20.4842837,3.12487675 C20.4963954,3.13149738 20.5086138,3.1386054 20.5207092,3.14599385 C20.5462817,3.16171991 20.5711374,3.17849139 20.5951659,3.19631489 C20.6026012,3.20175123 20.6098403,3.2072822 20.61702,3.21292535 C20.6798642,3.2622995 20.7368692,3.31923598 20.7864564,3.38228152 L20.7071,3.29289 C20.7424919,3.32828457 20.7746761,3.36567215 20.8036526,3.40469147 C20.8215141,3.42887139 20.8382852,3.45372715 20.8539361,3.47934192 C20.8613767,3.49138565 20.8684844,3.50360439 20.8753116,3.5159368 C20.886209,3.53570816 20.8966261,3.55611069 20.9063487,3.57690291 C20.9143013,3.59390079 20.9217834,3.6112037 20.9287539,3.62866339 C20.936686,3.64842272 20.9438791,3.6682042 20.9504547,3.6882654 C20.9552491,3.70314829 20.9598798,3.71853639 20.9641321,3.73400673 C20.9701673,3.75556509 20.975361,3.77725539 20.9798355,3.79920726 C20.9832739,3.81662457 20.9863478,3.83405084 20.9889579,3.85153301 C20.9920331,3.87147629 20.9944668,3.89211478 20.9962625,3.91293567 C20.9978187,3.93173446 20.9988803,3.94973359 20.999458,3.96774536 C20.9998183,3.9777894 21,3.98887348 21,4 L21,9 C21,9.55228 20.5523,10 20,10 C19.4477,10 19,9.55228 19,9 L19,6.414 L9.70711,15.7071 C9.31658,16.0976 8.68342,16.0976 8.29289,15.7071 C7.90237,15.3166 7.90237,14.6834 8.29289,14.2929 L17.584,5 L15,5 C14.4477,5 14,4.55228 14,4 C14,3.44772 14.4477,3 15,3 L20,3 Z" />
</svg>
```

#### Meatballs Icon (More Actions Menu)
**Type:** `meatballs` | **Usage:** Context menus, action dropdowns, more options

```html
<svg class="sap-crm-icon sap-crm-icon--md" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" role="img" aria-label="meatballs">
  <path fill="#0070F2" d="M5,10 C6.10457,10 7,10.8954 7,12 C7,13.1046 6.10457,14 5,14 C3.89543,14 3,13.1046 3,12 C3,10.8954 3.89543,10 5,10 Z M19,10 C20.1046,10 21,10.8954 21,12 C21,13.1046 20.1046,14 19,14 C17.8954,14 17,13.1046 17,12 C17,10.8954 17.8954,10 19,10 Z M12,10 C13.1046,10 14,10.8954 14,12 C14,13.1046 13.1046,14 12,14 C10.8954,14 10,13.1046 10,12 C10,10.8954 10.8954,10 12,10 Z" />
</svg>
```

**Typical Usage:** Combined with a dropdown menu for displaying contextual actions.

```html
<!-- Icon button with dropdown menu -->
<div class="sap-crm-modal-menu__button-wrapper">
  <button class="sap-crm-btn sap-crm-btn--primary sap-crm-btn--sm sap-crm-btn--md--icon_only" aria-label="More actions">
    <svg class="sap-crm-icon sap-crm-icon--md" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path fill="#0070F2" d="M5,10 C6.10457,10 7,10.8954 7,12 C7,13.1046 6.10457,14 5,14 C3.89543,14 3,13.1046 3,12 C3,10.8954 3.89543,10 5,10 Z M19,10 C20.1046,10 21,10.8954 21,12 C21,13.1046 20.1046,14 19,14 C17.8954,14 17,13.1046 17,12 C17,10.8954 17.8954,10 19,10 Z M12,10 C13.1046,10 14,10.8954 14,12 C14,13.1046 13.1046,14 12,14 C10.8954,14 10,13.1046 10,12 C10,10.8954 10.8954,10 12,10 Z" />
    </svg>
  </button>
  
  <!-- Dropdown menu (shown on click) -->
  <div class="sap-crm-modal-menu">
    <div class="sap-crm-modal-menu__item">Action 1</div>
    <div class="sap-crm-modal-menu__item">Action 2</div>
    <div class="sap-crm-modal-menu__item">Action 3</div>
  </div>
</div>
```

### Icon Usage Patterns

#### In Buttons
```html
<!-- Primary button with icon -->
<button class="sap-crm-btn sap-crm-btn--primary sap-crm-btn--md">
  <svg class="sap-crm-icon sap-crm-icon--sm" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path fill="#0070F2" d="M12,4 C12.5523,4 13,4.51168 13,5.14285714 L13,11 L18.8571429,11 C19.4883429,11 20,11.4477 20,12 C20,12.5523 19.4883429,13 18.8571429,13 L13,13 L13,18.8571429 C13,19.4883429 12.5523,20 12,20 C11.4477,20 11,19.4883429 11,18.8571429 L11,13 L5.14285714,13 C4.51168,13 4,12.5523 4,12 C4,11.4477 4.51168,11 5.14285714,11 L11,11 L11,5.14285714 C11,4.51168 11.4477,4 12,4 Z" />
  </svg>
  Add New
</button>

<!-- Icon-only button -->
<button class="sap-crm-btn sap-crm-btn--neutrallight sap-crm-btn--md sap-crm-btn--md--icon_only" aria-label="Close">
  <svg class="sap-crm-icon sap-crm-icon--sm" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path fill="#0070F2" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
</button>
```

#### In Table Headers (Sorting)
```html
<th class="sap-crm-table__cell sap-crm-table__cell--header" style="cursor: pointer;">
  Company Name
  <svg class="sap-crm-icon sap-crm-icon--sm" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="margin-left: 0.5rem; vertical-align: middle;">
    <path fill="#0070F2" d="M9.037 9.517 12 5.9l2.963 3.617H9.037Zm-2.117.267c-.395.483-.058 1.216.56 1.216h9.04c.618 0 .955-.733.56-1.216l-4.52-5.517a.721.721 0 0 0-1.12 0L6.92 9.783ZM12 18.1l2.963-3.617H9.037L12 18.1Zm-5.08-3.884C6.525 13.733 6.862 13 7.48 13h9.04c.618 0 .955.733.56 1.216l-4.52 5.517a.721.721 0 0 1-1.12 0l-4.52-5.517Z" />
  </svg>
</th>
```

#### In Search Inputs
```html
<div class="sap-crm-input sap-crm-input--spaceleft" style="position: relative;">
  <svg class="sap-crm-input__icon sap-crm-icon sap-crm-icon--sm" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%);">
    <path fill="#0070F2" d="M10.8889012,2 C15.7981303,2 19.7778025,5.97969442 19.7778025,10.8889012 C19.7778025,12.9430885 19.0810143,14.8345226 17.9108962,16.3397453 L21.6745829,20.1032474 C22.1084724,20.5371369 22.1084724,21.2406934 21.6745829,21.6745829 C21.2406934,22.1084724 20.5371369,22.1084724 20.1032474,21.6745829 L16.3397453,17.9108962 C14.8345226,19.0810143 12.9430885,19.7778025 10.8889012,19.7778025 C5.97969442,19.7778025 2,15.7981303 2,10.8889012 C2,5.97969442 5.97969442,2 10.8889012,2 Z M10.8889012,4.22222531 C7.20699612,4.22222531 4.22222531,7.20699612 4.22222531,10.8889012 C4.22222531,14.5707952 7.20699612,17.5555772 10.8889012,17.5555772 C14.5707952,17.5555772 17.5555772,14.5707952 17.5555772,10.8889012 C17.5555772,7.20699612 14.5707952,4.22222531 10.8889012,4.22222531 Z" />
  </svg>
  <input type="text" placeholder="Search..." style="padding-left: 2.5rem;">
</div>
```

### Icon Accessibility

Always include accessibility attributes:

```html
<svg 
  class="sap-crm-icon sap-crm-icon--md" 
  xmlns="http://www.w3.org/2000/svg" 
  viewBox="0 0 24 24" 
  fill="currentColor"
  role="img"
  aria-label="search">
  <!-- path data -->
</svg>
```

**For decorative icons in buttons with text:**
```html
<button class="sap-crm-btn sap-crm-btn--primary">
  <svg class="sap-crm-icon sap-crm-icon--sm" aria-hidden="true">
    <!-- path data -->
  </svg>
  Add New
</button>
```

**For icon-only buttons:**
```html
<button class="sap-crm-btn sap-crm-btn--md--icon_only" aria-label="Delete">
  <svg class="sap-crm-icon sap-crm-icon--sm" aria-hidden="true">
    <!-- trash icon path -->
  </svg>
</button>
```

### Icon Color Customization

Icons inherit the text color via `fill="currentColor"`:

```html
<!-- Blue icon -->
<svg class="sap-crm-icon sap-crm-icon--md" style="color: var(--color-primary-4);" fill="currentColor">
  <!-- path -->
</svg>

<!-- Red icon for delete -->
<svg class="sap-crm-icon sap-crm-icon--md" style="color: var(--color-accent-red-4);" fill="currentColor">
  <!-- path -->
</svg>

<!-- Green icon for success -->
<svg class="sap-crm-icon sap-crm-icon--md" style="color: var(--color-accent-green-4);" fill="currentColor">
  <!-- path -->
</svg>
```

### Complete Icon Reference Table

| Icon Type | Name | Common Usage | Recommended Size |
|-----------|------|--------------|------------------|
| Search | `search` | Search buttons, search inputs | `sm` or `md` |
| Plus | `plus` | Add/create buttons | `sm` |
| Close | `close` | Close dialogs, clear inputs | `sm` |
| Trash | `trash` | Delete actions | `sm` or `md` |
| Analytics | `analytics` | Analytics panels, reports | `md` or `lg` |
| Unsorted | `unsorted` | Default table sort state | `sm` |
| Ascending | `ascending` | Ascending sort indicator | `sm` |
| Descending | `descending` | Descending sort indicator | `sm` |
| Edit | `edit` | Edit actions | `sm` or `md` |
| Open Page | `open-page` | External links | `sm` or `md` |

---

## Badges

### Badge Structure

```html
<span class="sap-crm-badge sap-crm-badge--success">Active</span>
<span class="sap-crm-badge sap-crm-badge--error">Error</span>
<span class="sap-crm-badge sap-crm-badge--warning">Pending</span>
<span class="sap-crm-badge sap-crm-badge--info">Info</span>
<span class="sap-crm-badge sap-crm-badge--neutral">Inactive</span>
```

### Badge Variants

```css
.sap-crm-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 0.25rem;
  white-space: nowrap;
}

.sap-crm-badge--success {
  background: var(--color-accent-green-1);
  color: var(--color-accent-green-5);
}

.sap-crm-badge--error {
  background: var(--color-accent-red-1);
  color: var(--color-accent-red-5);
}

.sap-crm-badge--warning {
  background: var(--color-accent-yellow-1);
  color: var(--color-accent-yellow-5);
}

.sap-crm-badge--info {
  background: var(--color-primary-1);
  color: var(--color-primary-5);
}

.sap-crm-badge--neutral {
  background: var(--color-neutral-1);
  color: var(--color-neutral-6);
}
```

---

## Column Filters

The column filter system provides dropdown-based filtering with multi-select support, URL persistence, and active filter pills. Based on SAP Sales and Service Cloud V2 design patterns.

### Filter Bar

Main container for filter dropdowns:

```html
<div class="sap-crm-filter-bar">
  <div class="sap-crm-filter-bar__filters">
    <!-- Filter dropdowns go here -->
  </div>
</div>
```

```css
.sap-crm-filter-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
  background-color: var(--color-neutral-white);
  border: 1px solid var(--color-neutral-2);
  border-radius: 0.5rem;
}

.sap-crm-filter-bar__filters {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  flex-wrap: wrap;
}
```

### Filter Dropdown

Individual filter dropdown with button and menu:

```html
<div class="sap-crm-filter-dropdown">
  <button 
    type="button" 
    class="sap-crm-btn sap-crm-flex sap-crm-btn--neutrallight sap-crm-btn--md"
  >
    <span class="sap-crm-btn--dropdown__text">
      Status
      <span class="sap-crm-filter-count">(2)</span>
    </span>
    <div class="sap-crm-icon sap-crm-icon--md sap-crm-btn__icon sap-crm-btn__icon--right">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.35146815,8.75146815 C6.82010434,8.28284395 7.57989666,8.28284395 8.04853285,8.75146815 L12,12.7029618 L15.9514841,8.75146815 C16.4200843,8.28284395 17.1799247,8.28284395 17.6485249,8.75146815 C18.117125,9.22010434 18.117125,9.97992066 17.6485249,10.4485209 L12.8485229,15.2485229 C12.3799227,15.717123 11.6200823,15.717123 11.1514821,15.2485229 L6.35146815,10.4485209 C5.88284395,9.97992066 5.88284395,9.22010434 6.35146815,8.75146815 Z"></path>
      </svg>
    </div>
  </button>
  
  <div class="sap-crm-filter-dropdown__menu">
    <!-- Menu content -->
  </div>
</div>
```

#### Dropdown Arrow Icon

The dropdown uses a standard SAP arrow icon that changes direction based on state:

```html
<div class="sap-crm-icon sap-crm-icon--md sap-crm-btn__icon sap-crm-btn__icon--right">
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.35146815,8.75146815 C6.82010434,8.28284395 7.57989666,8.28284395 8.04853285,8.75146815 L12,12.7029618 L15.9514841,8.75146815 C16.4200843,8.28284395 17.1799247,8.28284395 17.6485249,8.75146815 C18.117125,9.22010434 18.117125,9.97992066 17.6485249,10.4485209 L12.8485229,15.2485229 C12.3799227,15.717123 11.6200823,15.717123 11.1514821,15.2485229 L6.35146815,10.4485209 C5.88284395,9.97992066 5.88284395,9.22010434 6.35146815,8.75146815 Z"></path>
  </svg>
</div>
```

**Key Features:**
- Medium size icon (`sap-crm-icon--md`)
- Positioned on right side of button (`sap-crm-btn__icon--right`)
- Uses `fill: currentColor` to inherit button text color
- Properly centered with flex layout

```css
.sap-crm-filter-dropdown {
  position: relative;
}

.sap-crm-filter-dropdown .sap-crm-btn {
  color: var(--color-primary-4); /* SAP Blue */
}

.sap-crm-filter-dropdown .sap-crm-btn--active {
  background-color: var(--color-primary-1);
  border-color: var(--color-primary-4);
  color: var(--color-primary-4);
  font-weight: 600;
}

.sap-crm-filter-count {
  margin-left: 0.25rem;
  font-weight: 600;
}
```

### Filter Dropdown Menu

The dropdown menu with checkboxes:

```html
<div class="sap-crm-filter-dropdown__menu">
  <div class="sap-crm-filter-dropdown__options">
    <label class="sap-crm-filter-dropdown__option">
      <input type="checkbox" checked>
      <span>Active</span>
    </label>
    <label class="sap-crm-filter-dropdown__option">
      <input type="checkbox">
      <span>Inactive</span>
    </label>
  </div>
  
  <div class="sap-crm-filter-dropdown__actions">
    <button class="sap-crm-btn sap-crm-btn--neutrallight sap-crm-btn--xsm">
      Select All
    </button>
    <button class="sap-crm-btn sap-crm-btn--neutrallight sap-crm-btn--xsm">
      Clear
    </button>
  </div>
</div>
```

```css
.sap-crm-filter-dropdown__menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  min-width: 220px;
  max-width: 320px;
  background-color: #ffffff;
  border: 1px solid var(--color-neutral-2);
  border-radius: 0.5rem;
  box-shadow: 0 4px 16px rgba(34, 53, 72, 0.15);
  overflow: hidden;
  z-index: 1000;
}

.sap-crm-filter-dropdown__options {
  max-height: 300px;
  overflow-y: auto;
  padding: 0.5rem 0;
}

.sap-crm-filter-dropdown__option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.sap-crm-filter-dropdown__option:hover {
  background-color: var(--color-neutral-1);
}

.sap-crm-filter-dropdown__option input[type="checkbox"] {
  cursor: pointer;
}

.sap-crm-filter-dropdown__actions {
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-top: 1px solid var(--color-neutral-2);
}
```

### Filter Pills Container

Container for active filter pills:

```html
<div class="filter-pills-container">
  <span class="filter-pills-label">Active Filters:</span>
  
  <!-- Filter pills -->
  <span class="sap-crm-filter-pill">
    <span class="sap-crm-filter-pill__label">Status: Active</span>
    <button class="sap-crm-filter-pill__remove" aria-label="Remove filter">✕</button>
  </span>
  
  <!-- Clear All button -->
  <button class="sap-crm-btn sap-crm-btn--neutrallight sap-crm-btn--md clear-all-filters-btn">
    CLEAR ALL
  </button>
</div>
```

```css
.filter-pills-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  margin-bottom: 1rem;
  background-color: var(--color-neutral-1);
  border-radius: 0.5rem;
  flex-wrap: wrap;
}

.filter-pills-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-secondary);
}
```

### Filter Pills

Individual filter pill with SAP blue background and white text:

```html
<span class="sap-crm-filter-pill">
  <span class="sap-crm-filter-pill__label">Status: Active</span>
  <button class="sap-crm-filter-pill__remove" aria-label="Remove filter">✕</button>
</span>
```

```css
.sap-crm-filter-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.5rem;
  background-color: var(--color-primary-4);  /* SAP Blue */
  border: 1px solid var(--color-primary-4);
  border-radius: 1rem;
  font-size: 0.875rem;
  color: #ffffff;  /* White text */
  line-height: 1.2;
}

.sap-crm-filter-pill__label {
  line-height: 1.4;
  color: #ffffff;
}

.sap-crm-filter-pill__remove {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;
  padding: 0;
  background: none;
  border: none;
  color: #ffffff;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: bold;
  transition: opacity 0.15s ease;
  opacity: 0.9;
}

.sap-crm-filter-pill__remove:hover {
  opacity: 1;
}
```

### Clear All Filters Button

Button with blue text to clear all active filters:

```css
.clear-all-filters-btn {
  color: var(--color-primary-4);
  margin-left: 0.5rem;
}
```

### Complete Filter Example

```html
<!-- Filter Bar -->
<div class="sap-crm-filter-bar">
  <div class="sap-crm-filter-bar__filters">
    <!-- Status Filter -->
    <div class="sap-crm-filter-dropdown">
      <button type="button" class="sap-crm-btn sap-crm-flex sap-crm-btn--neutrallight sap-crm-btn--md">
        <span class="sap-crm-btn--dropdown__text">
          Status
          <span class="sap-crm-filter-count">(2)</span>
        </span>
        <div class="sap-crm-icon sap-crm-icon--md sap-crm-btn__icon sap-crm-btn__icon--right">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.35146815,8.75146815 C6.82010434,8.28284395 7.57989666,8.28284395 8.04853285,8.75146815 L12,12.7029618 L15.9514841,8.75146815 C16.4200843,8.28284395 17.1799247,8.28284395 17.6485249,8.75146815 C18.117125,9.22010434 18.117125,9.97992066 17.6485249,10.4485209 L12.8485229,15.2485229 C12.3799227,15.717123 11.6200823,15.717123 11.1514821,15.2485229 L6.35146815,10.4485209 C5.88284395,9.97992066 5.88284395,9.22010434 6.35146815,8.75146815 Z"></path>
          </svg>
        </div>
      </button>
      
      <div class="sap-crm-filter-dropdown__menu">
        <div class="sap-crm-filter-dropdown__options">
          <label class="sap-crm-filter-dropdown__option">
            <input type="checkbox" checked>
            <span>Active</span>
          </label>
          <label class="sap-crm-filter-dropdown__option">
            <input type="checkbox" checked>
            <span>In Preparation</span>
          </label>
          <label class="sap-crm-filter-dropdown__option">
            <input type="checkbox">
            <span>Blocked</span>
          </label>
        </div>
        <div class="sap-crm-filter-dropdown__actions">
          <button class="sap-crm-btn sap-crm-btn--neutrallight sap-crm-btn--xsm">Select All</button>
          <button class="sap-crm-btn sap-crm-btn--neutrallight sap-crm-btn--xsm">Clear</button>
        </div>
      </div>
    </div>
    
    <!-- More filters... -->
  </div>
</div>

<!-- Active Filter Pills -->
<div class="filter-pills-container">
  <span class="filter-pills-label">Active Filters:</span>
  
  <span class="sap-crm-filter-pill">
    <span class="sap-crm-filter-pill__label">Status: Active</span>
    <button class="sap-crm-filter-pill__remove" aria-label="Remove filter">✕</button>
  </span>
  
  <span class="sap-crm-filter-pill">
    <span class="sap-crm-filter-pill__label">Status: In Preparation</span>
    <button class="sap-crm-filter-pill__remove" aria-label="Remove filter">✕</button>
  </span>
  
  <button class="sap-crm-btn sap-crm-btn--neutrallight sap-crm-btn--md clear-all-filters-btn">
    CLEAR ALL
  </button>
</div>
```

### Filter Behavior Notes

**Multi-Select:** Filters support multiple selections with checkbox controls  
**URL Persistence:** Active filters are synced to URL parameters for bookmarking and sharing  
**OData Integration:** Filters generate OData `$filter` query strings for backend filtering  
**Dropdown Arrow:** Uses standard SAP arrow icon that inherits button text color  
**Clear All:** Button appears only when filters are active, displays in blue text

---

## Usage Examples

### Complete Form Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SAP CRM Form Example</title>
  
  <!-- Import CSS files in order -->
  <link rel="stylesheet" href="sap-crm-colors.css">
  <link rel="stylesheet" href="sap-crm-global.css">
  <link rel="stylesheet" href="sap-crm-components.css">
</head>
<body style="padding: 2rem; background: var(--color-background-normal);">
  
  <form style="max-width: 600px; background: white; padding: 2rem; border-radius: 0.5rem;">
    <h2 style="margin-bottom: 1.5rem; color: var(--color-neutral-7);">Create Account</h2>
    
    <!-- Text Input -->
    <div style="margin-bottom: 1rem;">
      <label for="companyName" style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: var(--color-neutral-7);">
        Company Name *
      </label>
      <div class="sap-crm-input">
        <input type="text" id="companyName" placeholder="Enter company name" required>
      </div>
    </div>
    
    <!-- Email Input with Icon -->
    <div style="margin-bottom: 1rem;">
      <label for="email" style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: var(--color-neutral-7);">
        Email
      </label>
      <div class="sap-crm-input">
        <input type="email" id="email" placeholder="email@example.com">
      </div>
    </div>
    
    <!-- Radio Buttons -->
    <div style="margin-bottom: 1rem;">
      <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: var(--color-neutral-7);">
        Account Type *
      </label>
      <div style="display: flex; gap: 1.5rem;">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <div class="sap-crm-icontrol sap-crm-icontrol__radio">
            <input type="radio" name="type" id="typeCustomer" value="customer" checked>
            <div class="sap-crm-icontrol__wrap sap-crm-icontrol__wrap--radio"></div>
          </div>
          <label for="typeCustomer" style="margin: 0;">Customer</label>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <div class="sap-crm-icontrol sap-crm-icontrol__radio">
            <input type="radio" name="type" id="typeProspect" value="prospect">
            <div class="sap-crm-icontrol__wrap sap-crm-icontrol__wrap--radio"></div>
          </div>
          <label for="typeProspect" style="margin: 0;">Prospect</label>
        </div>
      </div>
    </div>
    
    <!-- Toggle Switch -->
    <div style="margin-bottom: 1rem; display: flex; align-items: center; justify-content: space-between;">
      <label for="activeSwitch" style="font-weight: 500; color: var(--color-neutral-7);">
        Active
      </label>
      <div class="sap-crm-icontrol sap-crm-icontrol__switch">
        <input type="checkbox" id="activeSwitch" checked>
        <div class="sap-crm-icontrol__wrap sap-crm-icontrol__wrap--switch">
          <div class="sap-crm-icontrol__icon"></div>
        </div>
      </div>
    </div>
    
    <!-- Textarea -->
    <div style="margin-bottom: 1.5rem;">
      <label for="notes" style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: var(--color-neutral-7);">
        Notes
      </label>
      <div class="sap-crm-input sap-crm-input--textarea">
        <textarea id="notes" rows="4" placeholder="Enter additional notes..."></textarea>
      </div>
    </div>
    
    <!-- Form Actions -->
    <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
      <button type="button" class="sap-crm-btn sap-crm-btn--secondary sap-crm-btn--md">
        Cancel
      </button>
      <button type="submit" class="sap-crm-btn sap-crm-btn--primary sap-crm-btn--md">
        Save Account
      </button>
    </div>
  </form>
  
</body>
</html>
```

### Complete Table Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SAP CRM Table Example</title>
  
  <link rel="stylesheet" href="sap-crm-colors.css">
  <link rel="stylesheet" href="sap-crm-global.css">
  <link rel="stylesheet" href="sap-crm-components.css">
</head>
<body style="padding: 2rem; background: var(--color-background-normal);">
  
  <div style="background: white; border-radius: 0.5rem; padding: 1.5rem;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
      <h2 style="margin: 0; color: var(--color-neutral-7);">Accounts</h2>
      <button class="sap-crm-btn sap-crm-btn--primary sap-crm-btn--md">
        + Add Account
      </button>
    </div>
    
    <div class="sap-crm-table--wrapper">
      <table class="sap-crm-table">
        <thead>
          <tr class="sap-crm-table__row">
            <th class="sap-crm-table__cell sap-crm-table__cell--header">ID</th>
            <th class="sap-crm-table__cell sap-crm-table__cell--header">Company</th>
            <th class="sap-crm-table__cell sap-crm-table__cell--header">Status</th>
            <th class="sap-crm-table__cell sap-crm-table__cell--header">Contact</th>
            <th class="sap-crm-table__cell sap-crm-table__cell--header">Actions</th>
          </tr>
        </thead>
        <tbody>
          <!-- Row with Success Indicator -->
          <tr class="sap-crm-table__row">
            <td class="sap-crm-table__cell" style="position: relative;">
              <div class="sap-crm-table__state sap-crm-table__state--success"></div>
              <span style="padding-left: 0.75rem;">ACC-001</span>
            </td>
            <td class="sap-crm-table__cell">Acme Corporation</td>
            <td class="sap-crm-table__cell">
              <span class="sap-crm-badge sap-crm-badge--success">Active</span>
            </td>
            <td class="sap-crm-table__cell">John Doe</td>
            <td class="sap-crm-table__cell">
              <button class="sap-crm-btn sap-crm-btn--neutrallight sap-crm-btn--sm">
                Edit
              </button>
            </td>
          </tr>
          
          <!-- Selected Row -->
          <tr class="sap-crm-table__row sap-crm-table__row--selected">
            <td class="sap-crm-table__cell" style="position: relative;">
              <div class="sap-crm-table__state sap-crm-table__state--caution"></div>
              <span style="padding-left: 0.75rem;">ACC-002</span>
            </td>
            <td class="sap-crm-table__cell">Tech Solutions Inc</td>
            <td class="sap-crm-table__cell">
              <span class="sap-crm-badge sap-crm-badge--warning">Pending</span>
            </td>
            <td class="sap-crm-table__cell">Jane Smith</td>
            <td class="sap-crm-table__cell">
              <button class="sap-crm-btn sap-crm-btn--neutrallight sap-crm-btn--sm">
                Edit
              </button>
            </td>
          </tr>
          
          <!-- Row with Error Indicator -->
          <tr class="sap-crm-table__row">
            <td class="sap-crm-table__cell" style="position: relative;">
              <div class="sap-crm-table__state sap-crm-table__state--error"></div>
              <span style="padding-left: 0.75rem;">ACC-003</span>
            </td>
            <td class="sap-crm-table__cell">Global Enterprises</td>
            <td class="sap-crm-table__cell">
              <span class="sap-crm-badge sap-crm-badge--error">Blocked</span>
            </td>
            <td class="sap-crm-table__cell">Bob Johnson</td>
            <td class="sap-crm-table__cell">
              <button class="sap-crm-btn sap-crm-btn--neutrallight sap-crm-btn--sm">
                Edit
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  
</body>
</html>
```

---

## Best Practices

### 1. **Always Use CSS Variables**
❌ **Bad:**
```css
.my-button {
  background-color: #0070f2;
}
```

✅ **Good:**
```css
.my-button {
  background-color: var(--color-primary-4);
}
```

### 2. **Follow the 8px Grid**
Use spacing based on multiples of 0.5rem (8px):
```css
padding: 1rem;        /* 16px */
margin-bottom: 1.5rem; /* 24px */
gap: 0.5rem;          /* 8px */
```

### 3. **Use Proper Font Weights**
```css
font-weight: 400;  /* Regular text */
font-weight: 500;  /* Medium (table cells) */
font-weight: 700;  /* Bold (buttons, headings) */
```

### 4. **Maintain Proper Contrast**
Ensure text meets WCAG 2.1 AA standards:
- Main text: `var(--color-neutral-7)` on white background
- Secondary text: `var(--color-neutral-5)`
- Disabled text: `var(--color-neutral-3)`

### 5. **Include Focus States**
Always provide visible focus indicators for accessibility:
```css
.my-button:focus-visible {
  box-shadow: 0 0 0 0.125rem var(--color-primary-4);
  outline: none;
}
```

### 6. **Use Transitions for Smooth Interactions**
```css
.my-button {
  transition: all 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

### 7. **Maintain Consistent Border Radius**
```css
border-radius: 0.25rem;  /* Inputs, small elements */
border-radius: 0.5rem;   /* Buttons, cards */
```

### 8. **Follow BEM Naming**
```css
.sap-crm-component           /* Block */
.sap-crm-component__element  /* Element */
.sap-crm-component--modifier /* Modifier */
```

---

## Framework Integration

### Vue.js
```vue
<template>
  <button class="sap-crm-btn sap-crm-btn--primary">
    Click Me
  </button>
</template>

<style scoped>
/* Import at app level, not in components */
@import '@/assets/css/sap-crm-colors.css';
@import '@/assets/css/sap-crm-global.css';
@import '@/assets/css/sap-crm-components.css';
</style>
```

### React
```jsx
import './assets/css/sap-crm-colors.css';
import './assets/css/sap-crm-global.css';
import './assets/css/sap-crm-components.css';

function MyButton() {
  return (
    <button className="sap-crm-btn sap-crm-btn--primary">
      Click Me
    </button>
  );
}
```

### Angular
```typescript
// angular.json
"styles": [
  "src/assets/css/sap-crm-colors.css",
  "src/assets/css/sap-crm-global.css",
  "src/assets/css/sap-crm-components.css"
]
```

```html
<!-- component.html -->
<button class="sap-crm-btn sap-crm-btn--primary">
  Click Me
</button>
```

---

## Support & Resources

### Key Principles
- Clean & Clear
- Simple & Intuitive
- Responsive & Adaptive
- Coherent & Consistent
- Accessible (WCAG 2.1 AA)

### CSS File Sizes
- **sap-crm-colors.css**: ~400 lines (color definitions only)
- **sap-crm-global.css**: ~340 lines (resets and typography)
- **sap-crm-components.css**: ~3325 lines (all UI components including filters)

### Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

---

**This style guide covers the core SAP Sales and Service Cloud V2 design system as implemented in this application. For the complete CSS files and source code, refer to the `src/assets/css/` directory.**

# CSS Consolidation Guide

This guide helps you systematically remove duplicate CSS selectors from your codebase.

## 🎯 Priority Order

### Phase 1: Safe Consolidations (High Impact)
These selectors have identical rules and can be safely consolidated:



### Phase 2: Manual Review (Medium Impact)
These selectors have different rules and need manual review:

21. **.loading-text** (4 instances)
   - Review 3 different rule variations
   - Consider extracting common properties to CSS variables

22. **.category-header** (4 instances)
   - Review 3 different rule variations
   - Consider extracting common properties to CSS variables

23. **.category-name** (4 instances)
   - Review 3 different rule variations
   - Consider extracting common properties to CSS variables

24. **.selected-spell-info** (4 instances)
   - Review 3 different rule variations
   - Consider extracting common properties to CSS variables

25. **.stat-header** (4 instances)
   - Review 3 different rule variations
   - Consider extracting common properties to CSS variables

26. **.form-input:focus** (4 instances)
   - Review 3 different rule variations
   - Consider extracting common properties to CSS variables

27. **.error-details** (4 instances)
   - Review 3 different rule variations
   - Consider extracting common properties to CSS variables

28. **.clear-selection-btn:hover** (4 instances)
   - Review 3 different rule variations
   - Consider extracting common properties to CSS variables

29. **.loading-state i** (4 instances)
   - Review 3 different rule variations
   - Consider extracting common properties to CSS variables

30. **.results-count** (4 instances)
   - Review 3 different rule variations
   - Consider extracting common properties to CSS variables

31. **.community-error-state p** (4 instances)
   - Review 3 different rule variations
   - Consider extracting common properties to CSS variables

32. **.ability-meta** (4 instances)
   - Review 3 different rule variations
   - Consider extracting common properties to CSS variables

33. **.setting-group label** (4 instances)
   - Review 3 different rule variations
   - Consider extracting common properties to CSS variables

34. **.formula-input:focus** (4 instances)
   - Review 3 different rule variations
   - Consider extracting common properties to CSS variables

35. **.toggle-switch** (4 instances)
   - Review 3 different rule variations
   - Consider extracting common properties to CSS variables

36. **.three-column** (4 instances)
   - Review 3 different rule variations
   - Consider extracting common properties to CSS variables

37. **.center-control** (3 instances)
   - Review 2 different rule variations
   - Consider extracting common properties to CSS variables

38. **.loot-item-details** (3 instances)
   - Review 2 different rule variations
   - Consider extracting common properties to CSS variables

39. **.form-section::before** (3 instances)
   - Review 2 different rule variations
   - Consider extracting common properties to CSS variables

40. **.checkbox-label:hover** (3 instances)
   - Review 2 different rule variations
   - Consider extracting common properties to CSS variables

## 🛠️ Implementation Steps

1. **Create shared CSS variables** for common values (colors, spacing, etc.)
2. **Move consolidated selectors** to shared CSS files
3. **Update component imports** to include shared styles
4. **Remove duplicate rules** from individual component files
5. **Test thoroughly** after each consolidation batch

## 📊 Expected Benefits

- **File size reduction**: ~10-20KB
- **Improved maintainability**: Single source of truth for styles
- **Better performance**: Reduced CSS parsing time
- **Easier theming**: Centralized style variables

## ⚠️ Important Notes

- Always test components after removing CSS rules
- Use CSS variables for themable values
- Consider using CSS modules for component-scoped styles
- Run automated tests before and after changes

## 🔄 Next Steps

1. Start with Phase 1 consolidations
2. Create CSS variables for common values
3. Gradually remove duplicates
4. Re-run the consolidation script to verify progress

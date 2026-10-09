import { loadPosts } from '../lib/content.ts';
import { editorialBudget } from '../lib/editorial-budget.ts';

console.log(JSON.stringify(editorialBudget(loadPosts()), null, 2));

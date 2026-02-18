# BrainMark

A professional digital hive for your discoveries.

## 🛠️ Challenges Faced

### 1. Implementing Real-time UI Subscription
Initially, it was working before I added a reorder animation. After adding the animation, the motion was using an array and storing the state of the div to render; hence, the real-time update was not showing in the UI due to Framer Motion. Later, I removed the animation and it worked fine.

### 2. Real-time Deletion
By default, Supabase was only caring about `INSERT` bookmarks and was not updating real-time for `DELETE` queries. I fixed that by running the following query:

```sql
ALTER TABLE bookmarks REPLICA IDENTITY FULL;
```

---
Built by [Deepesh](https://deepesh-sr.github.io/golden_retriever/) 🍯

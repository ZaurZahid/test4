import React, { useEffect, useState } from 'react';
import { FixedSizeList as List } from 'react-window';
import { useData } from '../state/DataContext';
import { Link } from 'react-router-dom';

function Items() {
  const { items, fetchItems, totalPages } = useData();
  const [page, setPage] = useState(1);
  const [limit] = useState(100);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    const safeFetch = async () => {
      setLoading(true);
      try {
        await fetchItems({ page, limit, q: search });
        if (!active) return;
      } catch (err) {
        if (active) console.error(err);
      } finally {
        if (active) setLoading(false);
      }
    };

    safeFetch();

    return () => {
      active = false;
    };
  }, [fetchItems, page, limit, search]);

  const onSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const Row = ({ index, style }) => {
    const item = items[index];
    if (!item) return null;
    return (
      <div
        style={{
          ...style,
          display: 'flex',
          alignItems: 'center',
          padding: '0 12px',
          borderBottom: '1px solid #eee',
          backgroundColor: index % 2 === 0 ? '#fafafa' : '#fff',
        }}
        role="listitem"
        tabIndex={-1}
        key={item.id}
      >
        <Link
          to={`/items/${item.id}`}
          style={{ textDecoration: 'none', color: '#0366d6' }}
          tabIndex={0}
        >
          {item.name}
        </Link>
      </div>
    );
  };

  return (
    <section aria-label="Items List" style={{ maxWidth: 600, margin: '2rem auto', fontFamily: 'Arial, sans-serif' }}>
      <label htmlFor="search-input" style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
        Search items:
      </label>
      <input
        id="search-input"
        type="search"
        placeholder="Type to search..."
        value={search}
        onChange={onSearchChange}
        style={{
          width: '100%',
          padding: '10px 12px',
          fontSize: 16,
          borderRadius: 4,
          border: '1px solid #ccc',
          marginBottom: 16,
          boxSizing: 'border-box',
        }}
        aria-describedby="search-help"
      />
      <div id="search-help" style={{ marginBottom: 20, color: '#666', fontSize: 14 }}>
        Use the input above to filter items by name.
      </div>

      {loading ? (
        <div role="status" aria-live="polite" style={{ padding: 20, textAlign: 'center' }}>
          Loading items...
        </div>
      ) : items.length === 0 ? (
        <div role="alert" style={{ padding: 20, textAlign: 'center', color: '#999' }}>
          No items found.
        </div>
      ) : (
        <List
          height={400}
          itemCount={items.length}
          itemSize={40}
          width={'100%'}
          role="list"
        >
          {Row}
        </List>
      )}

      <nav
        aria-label="Pagination"
        style={{ marginTop: 20, display: 'flex', justifyContent: 'center', gap: 12 }}
      >
        <button
          onClick={() => setPage(p => p - 1)}
          disabled={page <= 1 || loading}
          aria-disabled={page <= 1 || loading}
          style={{
            padding: '10px 16px',
            fontSize: 16,
            borderRadius: 4,
            border: '1px solid #ccc',
            backgroundColor: page <= 1 || loading ? '#eee' : '#0366d6',
            color: page <= 1 || loading ? '#999' : '#fff',
            cursor: page <= 1 || loading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.3s ease',
          }}
        >
          Prev
        </button>

        <span
          style={{ fontSize: 16, lineHeight: '38px', userSelect: 'none' }}
          aria-live="polite"
        >
          Page {page} of {totalPages || 1}
        </span>

        <button
          onClick={() => setPage(p => p + 1)}
          disabled={loading || (totalPages && page >= totalPages)}
          aria-disabled={loading || (totalPages && page >= totalPages)}
          style={{
            padding: '10px 16px',
            fontSize: 16,
            borderRadius: 4,
            border: '1px solid #ccc',
            backgroundColor: loading || (totalPages && page >= totalPages) ? '#eee' : '#0366d6',
            color: loading || (totalPages && page >= totalPages) ? '#999' : '#fff',
            cursor: loading || (totalPages && page >= totalPages) ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.3s ease',
          }}
        >
          Next
        </button>
      </nav>
    </section>
  );
}

export default Items;

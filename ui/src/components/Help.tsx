import React from 'react';
import { Box, Typography, Paper, Divider, Link } from '@mui/material';
import { Code as CodeIcon, PlayCircleOutline as VideoIcon } from '@mui/icons-material';

const Help: React.FC = () => {
  return (
    <Box
      sx={{
        width: '100%',
        height: 'calc(100vh - 200px)',
        overflow: 'auto',
        p: 2,
      }}
    >
      {/* YouTube Tutorial Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <VideoIcon color="primary" />
          Getting Started with SurrealDB
        </Typography>
        <Box sx={{ mt: 2, position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
          <iframe
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none',
              borderRadius: '4px',
            }}
            src="https://www.youtube.com/embed/LCAIkx1p1k0"
            title="SurrealDB Tutorial"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </Box>
      </Paper>

      {/* Demo Data Information */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Surreal Deal Store - Demo Dataset
        </Typography>
        <Typography variant="body2" paragraph>
          The Surreal Deal Store demo dataset is pre-loaded with sample data including products, customers, orders, and reviews.
          It demonstrates SurrealDB's capabilities with both graph relations and record links across 12 tables.
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          The database is configured with:
        </Typography>
        <Typography variant="body2" component="div" sx={{ pl: 2 }}>
          • <strong>Namespace:</strong> test<br />
          • <strong>Database:</strong> test<br />
          • <strong>Connection:</strong> http://host.docker.internal:8000<br />
          • <strong>Credentials:</strong> root / root
        </Typography>
      </Paper>

      {/* Sample Queries Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CodeIcon color="primary" />
          Sample Queries
        </Typography>
        <Divider sx={{ my: 2 }} />

        {/* Query 1 */}
        <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
          1. View all products
        </Typography>
        <Paper variant="outlined" sx={{ p: 2, bgcolor: '#1e1e1e', mb: 3 }}>
          <code style={{ color: '#d4d4d4', fontFamily: 'monospace', fontSize: '13px' }}>
            SELECT * FROM product LIMIT 10;
          </code>
        </Paper>

        {/* Query 2 */}
        <Typography variant="subtitle2" gutterBottom>
          2. Find products with their categories
        </Typography>
        <Paper variant="outlined" sx={{ p: 2, bgcolor: '#1e1e1e', mb: 3 }}>
          <code style={{ color: '#d4d4d4', fontFamily: 'monospace', fontSize: '13px' }}>
            SELECT *, category.* FROM product FETCH category LIMIT 5;
          </code>
        </Paper>

        {/* Query 3 */}
        <Typography variant="subtitle2" gutterBottom>
          3. Get customers and their orders
        </Typography>
        <Paper variant="outlined" sx={{ p: 2, bgcolor: '#1e1e1e', mb: 3 }}>
          <code style={{ color: '#d4d4d4', fontFamily: 'monospace', fontSize: '13px', display: 'block', whiteSpace: 'pre-wrap' }}>
{`SELECT
  name,
  email,
  <-order<-person AS orders
FROM person
LIMIT 5;`}
          </code>
        </Paper>

        {/* Query 4 */}
        <Typography variant="subtitle2" gutterBottom>
          4. View product reviews with ratings
        </Typography>
        <Paper variant="outlined" sx={{ p: 2, bgcolor: '#1e1e1e', mb: 3 }}>
          <code style={{ color: '#d4d4d4', fontFamily: 'monospace', fontSize: '13px', display: 'block', whiteSpace: 'pre-wrap' }}>
{`SELECT
  product.name AS product_name,
  rating,
  comment,
  created_at
FROM review
FETCH product
LIMIT 10;`}
          </code>
        </Paper>

        {/* Query 5 */}
        <Typography variant="subtitle2" gutterBottom>
          5. Calculate total revenue per product
        </Typography>
        <Paper variant="outlined" sx={{ p: 2, bgcolor: '#1e1e1e', mb: 3 }}>
          <code style={{ color: '#d4d4d4', fontFamily: 'monospace', fontSize: '13px', display: 'block', whiteSpace: 'pre-wrap' }}>
{`SELECT
  product.name,
  count() AS total_orders,
  math::sum(price) AS total_revenue
FROM order_item
GROUP BY product
LIMIT 10;`}
          </code>
        </Paper>

        {/* Query 6 */}
        <Typography variant="subtitle2" gutterBottom>
          6. Create a new product
        </Typography>
        <Paper variant="outlined" sx={{ p: 2, bgcolor: '#1e1e1e', mb: 3 }}>
          <code style={{ color: '#d4d4d4', fontFamily: 'monospace', fontSize: '13px', display: 'block', whiteSpace: 'pre-wrap' }}>
{`CREATE product SET
  name = "Custom Product",
  price = 29.99,
  description = "A custom product for testing",
  stock = 100;`}
          </code>
        </Paper>

        {/* Query 7 */}
        <Typography variant="subtitle2" gutterBottom>
          7. Update product price
        </Typography>
        <Paper variant="outlined" sx={{ p: 2, bgcolor: '#1e1e1e', mb: 3 }}>
          <code style={{ color: '#d4d4d4', fontFamily: 'monospace', fontSize: '13px', display: 'block', whiteSpace: 'pre-wrap' }}>
{`UPDATE product
SET price = 24.99
WHERE name = "Custom Product";`}
          </code>
        </Paper>

        {/* Query 8 */}
        <Typography variant="subtitle2" gutterBottom>
          8. Graph traversal - Find related products
        </Typography>
        <Paper variant="outlined" sx={{ p: 2, bgcolor: '#1e1e1e', mb: 3 }}>
          <code style={{ color: '#d4d4d4', fontFamily: 'monospace', fontSize: '13px', display: 'block', whiteSpace: 'pre-wrap' }}>
{`SELECT
  name,
  ->purchased_with->product.name AS related_products
FROM product
WHERE name = "SurrealDB T-Shirt"
LIMIT 5;`}
          </code>
        </Paper>
      </Paper>

      {/* Key Concepts */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Key SurrealQL Concepts
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
          • Graph Relations
        </Typography>
        <Typography variant="body2" paragraph sx={{ pl: 2 }}>
          Use <code>-&gt;</code> and <code>&lt;-</code> to traverse graph relationships between records.
        </Typography>

        <Typography variant="subtitle2" gutterBottom>
          • Record Links
        </Typography>
        <Typography variant="body2" paragraph sx={{ pl: 2 }}>
          Link records together using record IDs for efficient data relationships.
        </Typography>

        <Typography variant="subtitle2" gutterBottom>
          • FETCH Clause
        </Typography>
        <Typography variant="body2" paragraph sx={{ pl: 2 }}>
          Retrieve related records in a single query using the FETCH clause.
        </Typography>

        <Typography variant="subtitle2" gutterBottom>
          • Aggregations
        </Typography>
        <Typography variant="body2" paragraph sx={{ pl: 2 }}>
          Use functions like <code>count()</code>, <code>math::sum()</code>, and <code>GROUP BY</code> for data aggregation.
        </Typography>
      </Paper>

      {/* Resources */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Additional Resources
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body2" paragraph>
          <Link href="https://surrealdb.com/docs" target="_blank" rel="noopener">
            📚 Official Documentation
          </Link>
        </Typography>
        <Typography variant="body2" paragraph>
          <Link href="https://surrealdb.com/docs/surrealql" target="_blank" rel="noopener">
            📖 SurrealQL Reference
          </Link>
        </Typography>
        <Typography variant="body2" paragraph>
          <Link href="https://surrealdb.com/docs/surrealql/demo" target="_blank" rel="noopener">
            🎯 Demo Data Documentation
          </Link>
        </Typography>
        <Typography variant="body2">
          <Link href="https://github.com/surrealdb/surrealdb" target="_blank" rel="noopener">
            💻 GitHub Repository
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Help;

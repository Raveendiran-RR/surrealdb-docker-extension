import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Link,
  Button,
} from '@mui/material';
import { createDockerDesktopClient } from '@docker/extension-api-client';

const Help: React.FC = () => {
  const ddClient = createDockerDesktopClient();

  const openExternalLink = (url: string) => {
    ddClient.host.openExternal(url);
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        overflow: 'auto',
        p: 2,
      }}
    >
      <Typography variant="h6" gutterBottom>
        SurrealDB Getting Started
      </Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Video Tutorial
        </Typography>
        <Typography variant="body2" paragraph>
          Watch the SurrealDB Introduction video to learn about the database features and capabilities.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => openExternalLink('https://www.youtube.com/watch?v=C7WFwgDRStM')}
          sx={{ mt: 1 }}
        >
          Watch on YouTube
        </Button>
      </Paper>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Demo Data: Surreal Deal Store Mini
        </Typography>
        <Typography variant="body2" paragraph>
          The demo data has been automatically imported into the <code>test</code> namespace and <code>test</code> database.
          This dataset includes 12 tables demonstrating SurrealDB's multi-model capabilities with graph relations and record links.
        </Typography>
        <Typography variant="body2">
          Connection details:
        </Typography>
        <Box component="ul" sx={{ mt: 1, mb: 1 }}>
          <li>
            <Typography variant="body2">
              <strong>Endpoint:</strong> http://localhost:8000
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <strong>Namespace:</strong> test
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <strong>Database:</strong> test
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <strong>Username:</strong> root
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <strong>Password:</strong> root
            </Typography>
          </li>
        </Box>
      </Paper>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Sample SurrealQL Queries
        </Typography>

        <Divider sx={{ my: 1 }} />

        <Typography variant="body2" fontWeight="bold" sx={{ mt: 2 }}>
          1. Select All Products
        </Typography>
        <Paper sx={{ p: 1, bgcolor: 'grey.900', color: 'grey.100', mt: 1, fontFamily: 'monospace', fontSize: '0.85rem' }}>
          SELECT * FROM product;
        </Paper>

        <Typography variant="body2" fontWeight="bold" sx={{ mt: 2 }}>
          2. Full-Text Search in Reviews
        </Typography>
        <Paper sx={{ p: 1, bgcolor: 'grey.900', color: 'grey.100', mt: 1, fontFamily: 'monospace', fontSize: '0.85rem' }}>
          SELECT -&gt;product.name, review_text FROM review WHERE review_text @@ 'wearing nonstop';
        </Paper>

        <Typography variant="body2" fontWeight="bold" sx={{ mt: 2 }}>
          3. Create a New Product
        </Typography>
        <Paper sx={{ p: 1, bgcolor: 'grey.900', color: 'grey.100', mt: 1, fontFamily: 'monospace', fontSize: '0.85rem' }}>
          CREATE product CONTENT &#123;{'\n'}
          &nbsp;&nbsp;name: "My Product",{'\n'}
          &nbsp;&nbsp;price: 29.99,{'\n'}
          &nbsp;&nbsp;description: "A great product"{'\n'}
          &#125;;
        </Paper>

        <Typography variant="body2" fontWeight="bold" sx={{ mt: 2 }}>
          4. Update Product Price
        </Typography>
        <Paper sx={{ p: 1, bgcolor: 'grey.900', color: 'grey.100', mt: 1, fontFamily: 'monospace', fontSize: '0.85rem' }}>
          UPDATE product SET price = 24.99 WHERE name = "My Product";
        </Paper>

        <Typography variant="body2" fontWeight="bold" sx={{ mt: 2 }}>
          5. Graph Traversal - Find Related Products
        </Typography>
        <Paper sx={{ p: 1, bgcolor: 'grey.900', color: 'grey.100', mt: 1, fontFamily: 'monospace', fontSize: '0.85rem' }}>
          SELECT * FROM product WHERE id = product:1 FETCH -&gt;review-&gt;customer;
        </Paper>

        <Typography variant="body2" fontWeight="bold" sx={{ mt: 2 }}>
          6. Aggregation Query
        </Typography>
        <Paper sx={{ p: 1, bgcolor: 'grey.900', color: 'grey.100', mt: 1, fontFamily: 'monospace', fontSize: '0.85rem' }}>
          SELECT count() AS total_products, math::mean(price) AS avg_price FROM product;
        </Paper>
      </Paper>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Key Concepts
        </Typography>

        <Typography variant="body2" paragraph>
          <strong>Multi-Model Database:</strong> SurrealDB combines document, graph, key-value, and full-text search capabilities in one database.
        </Typography>

        <Typography variant="body2" paragraph>
          <strong>Graph Relations:</strong> Use <code>-&gt;</code> and <code>&lt;-</code> operators to traverse relationships between records.
        </Typography>

        <Typography variant="body2" paragraph>
          <strong>Record Links:</strong> Connect data across tables using record IDs and relationships.
        </Typography>

        <Typography variant="body2" paragraph>
          <strong>Full-Text Search:</strong> Use the <code>@@</code> operator for full-text search queries.
        </Typography>

        <Typography variant="body2" paragraph>
          <strong>CRUD Operations:</strong> Use SELECT, CREATE, UPDATE, DELETE for standard database operations.
        </Typography>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Resources
        </Typography>
        <Box component="ul">
          <li>
            <Link
              component="button"
              variant="body2"
              onClick={() => openExternalLink('https://surrealdb.com/docs')}
              sx={{ cursor: 'pointer', textAlign: 'left' }}
            >
              Official Documentation
            </Link>
          </li>
          <li>
            <Link
              component="button"
              variant="body2"
              onClick={() => openExternalLink('https://surrealdb.com/docs/surrealql')}
              sx={{ cursor: 'pointer', textAlign: 'left' }}
            >
              SurrealQL Language Guide
            </Link>
          </li>
          <li>
            <Link
              component="button"
              variant="body2"
              onClick={() => openExternalLink('https://surrealdb.com/docs/surrealql/demo')}
              sx={{ cursor: 'pointer', textAlign: 'left' }}
            >
              Demo Data Documentation
            </Link>
          </li>
          <li>
            <Link
              component="button"
              variant="body2"
              onClick={() => openExternalLink('https://datasets.surrealdb.com/')}
              sx={{ cursor: 'pointer', textAlign: 'left' }}
            >
              Download Demo Datasets
            </Link>
          </li>
        </Box>
      </Paper>
    </Box>
  );
};

export default Help;

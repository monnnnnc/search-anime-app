import React, { useEffect, useState } from "react";
import { Container, TextField, Grid, Box, CircularProgress, Button, Typography, Alert } from "@mui/material";
import { searchAnime } from "../api/jikan";
import TopBar from "../components/TopBar";
import AnimeCard from "../components/AnimeCard";
import { debounce } from "lodash";

const SearchPage = () => {
  const [query, setQuery] = useState("naruto");
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (q, p = 1) => {
    try {
      setLoading(true);
      setError(null);
      const data = await searchAnime(q, p);
      setResults(data.data);
      setTotalPages(data.pagination.last_visible_page);
    } catch (err) {
      setError("Failed to fetch anime.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounced = debounce(() => {
      setPage(1);
      fetchData(query, 1);
    }, 250);
    debounced();
    return () => debounced.cancel();
  }, [query]);

  useEffect(() => {
    fetchData(query, page);
  }, [page]);

  return (
    <div>
      <TopBar title="Anime Search App" />
      <Container maxWidth="lg" sx={{ mt: 4, mb:4 }}>
        <TextField fullWidth placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} sx={{ mb: 4 }} />
        {loading && <Box textAlign="center"><CircularProgress /></Box>}
        {error && <Alert severity="error">{error}</Alert>}
        {!loading && !error && results.length === 0 && <Typography>No results found.</Typography>}

        <Box display="flex" justifyContent="center">
          <Grid container spacing={3} justifyContent="center" maxWidth="lg">
            {results.map(anime => (
              <Grid item key={anime.mal_id} xs={12} sm={6} md={4} lg={3}>
                <AnimeCard anime={anime} />
              </Grid>
            ))}
          </Grid>
        </Box>


        <Box display="flex" justifyContent="space-between" mt={4}>
          <Button disabled={page === 1} onClick={() => setPage(page - 1)} variant="contained" sx={{ backgroundColor: "#6A1B9A" }}>Previous</Button>
          <Typography>Page {page} of {totalPages}</Typography>
          <Button disabled={page === totalPages} onClick={() => setPage(page + 1)} variant="contained" sx={{ backgroundColor: "#6A1B9A" }}>Next</Button>
        </Box>
      </Container>
    </div>
  );
};

export default SearchPage;
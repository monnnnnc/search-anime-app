import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  AppBar,
  Toolbar,
  Typography,
  TextField,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Container,
  Box,
  CircularProgress,
  Alert
} from "@mui/material";
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from "react-router-dom";
import { debounce } from "lodash";

function AnimeSearchApp() {
  const [query, setQuery] = useState("naruto");
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAnime = async (currentQuery = query, currentPage = page) => {
    if (!currentQuery.trim()) return;
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`https://api.jikan.moe/v4/anime`, {
        params: {
          q: encodeURIComponent(currentQuery),
          page: currentPage,
          limit: 12,
        },
      });
      setResults(res.data.data);
      setTotalPages(res.data.pagination?.last_visible_page || 1);
    } catch (err) {
      setError("Failed to fetch anime. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debouncedFetch = debounce(() => {
      setPage(1);
      fetchAnime(query, 1);
    }, 250);
    debouncedFetch();
    return () => debouncedFetch.cancel();
  }, [query]);

  useEffect(() => {
    if (page <= totalPages) fetchAnime(query, page);
  }, [page]);

  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fff" }}>
      <AppBar position="static" style={{ backgroundColor: "#6A1B9A" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Anime Search App
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" style={{ marginTop: 20 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search for anime..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{ marginBottom: 4 }}
        />

        {loading && <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>}
        {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

        {!loading && !error && results.length === 0 && (
          <Box display="flex" justifyContent="center" alignItems="center" height="50vh" textAlign="center">
            <Typography variant="h6">
              No results found.
            </Typography>
          </Box>
        )}

        <Grid container spacing={3} justifyContent="center">
          {results.map((anime) => (
            <Grid item key={anime.mal_id} xs={12} sm={6} md={4} lg={3}>
              <Card sx={{ width: 225, cursor: "pointer" }} onClick={() => navigate(`/anime/${anime.mal_id}`)}>
                <CardMedia
                  component="img"
                  image={anime.images?.jpg?.image_url || "https://via.placeholder.com/225x318?text=No+Image"}
                  alt={anime.title || "No Title"}
                  onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/225x318?text=No+Image")}
                />
                <CardContent>
                  <Typography variant="body2" component="div">
                    {anime.title || "No Title Available"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container justifyContent="space-between" alignItems="center" sx={{ mt: 4 }}>
          <Button variant="contained" disabled={page === 1} onClick={() => setPage(page - 1)} sx={{ backgroundColor: "#6A1B9A" }}>
            Previous
          </Button>
          <Typography>Page {page} of {totalPages}</Typography>
          <Button variant="contained" onClick={() => setPage(page + 1)} disabled={page === totalPages} sx={{ backgroundColor: "#6A1B9A" }}>
            Next
          </Button>
        </Grid>
      </Container>
    </div>
  );
}

function AnimeDetail() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get(`https://api.jikan.moe/v4/anime/${id}`)
      .then((res) => setAnime(res.data.data))
      .catch(() => setError("Failed to load anime details."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!anime) return <Alert severity="info">Anime not found.</Alert>;

  return (
    <div>
      <AppBar position="static" sx={{ backgroundColor: "#6A1B9A" }}>
        <Toolbar>
          <Typography variant="h6">Anime Detail</Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" flexWrap="wrap" gap={4}>
          <Box flex="1 1 25%">
            <Box
              component="img"
              src={anime.images?.jpg?.image_url || "https://via.placeholder.com/400x600?text=No+Image"}
              alt={anime.title || "No Title"}
              sx={{ width: "100%", height: "auto" }}
              onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/400x600?text=No+Image")}
            />
          </Box>
          <Box flex="1 1 70%">
            <Typography variant="h6" gutterBottom>Synopsis</Typography>
            <Typography paragraph>{anime.synopsis || "No synopsis available."}</Typography>
            <Box display="flex" gap={2} flexWrap="wrap" mt={2}>
              {[{
                label: "Score",
                value: anime.score ?? "N/A",
                color: "#e3f2fd"
              }, {
                label: "Ranked",
                value: anime.rank ? `#${anime.rank}` : "N/A",
                color: "#fce4ec"
              }, {
                label: "Popularity",
                value: anime.popularity ? `#${anime.popularity}` : "N/A",
                color: "#f3e5f5"
              }, {
                label: "Members",
                value: anime.members ? anime.members.toLocaleString() : "N/A",
                color: "#e0f2f1"
              }].map((stat, idx) => (
                <Box key={idx} bgcolor={stat.color} p={2} flexBasis="120px" textAlign="center" borderRadius={1}>
                  <Typography variant="h6">{stat.value}</Typography>
                  <Typography variant="caption">{stat.label}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
        <Box mt={4}>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#6A1B9A" }}
            onClick={() => window.history.length > 1 ? window.history.back() : window.location.assign("/")}
          >
            Back
          </Button>
        </Box>
      </Container>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AnimeSearchApp />} />
        <Route path="/anime/:id" element={<AnimeDetail />} />
      </Routes>
    </Router>
  );
}

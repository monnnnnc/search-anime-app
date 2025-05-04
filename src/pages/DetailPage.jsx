
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Box, Typography, CircularProgress, Alert, Button } from "@mui/material";
import { getAnimeById } from "../api/jikan";
import TopBar from "../components/TopBar";
import AnimeStats from "../components/AnimeStats";

const DetailPage = () => {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getAnimeById(id)
      .then(data => setAnime(data.data))
      .catch(() => setError("Failed to fetch anime details."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Box textAlign="center" mt={4}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!anime) return <Alert severity="info">Anime not found.</Alert>;

  return (
    <div>
      <TopBar title="Anime Detail" />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box display="flex" gap={4} flexWrap="wrap">
          <Box flexBasis="25%">
            <Box
              component="img"
              src={anime.images?.jpg?.image_url || "https://via.placeholder.com/400x600?text=No+Image"}
              alt={anime.title || "No Title"}
              sx={{ width: "100%", height: "auto" }}
              onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/400x600?text=No+Image")}
            />
          </Box>
          <Box flexBasis="70%">
            <Typography variant="h6">Synopsis</Typography>
            <Typography>{anime.synopsis || "No synopsis available."}</Typography>
            <AnimeStats anime={anime} />
          </Box>
        </Box>
        <Box mt={4}>
          <Button onClick={() => navigate(-1)} variant="contained" sx={{ backgroundColor: "#6A1B9A" }}>Back</Button>
        </Box>
      </Container>
    </div>
  );
};

export default DetailPage;
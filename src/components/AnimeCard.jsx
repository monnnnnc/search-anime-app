import React from "react";
import { Card, CardMedia, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AnimeCard = ({ anime }) => {
  const navigate = useNavigate();
  return (
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
  );
};

export default AnimeCard;
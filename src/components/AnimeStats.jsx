import React from "react";
import { Box, Typography } from "@mui/material";

const AnimeStats = ({ anime }) => {
  const stats = [
    { label: "Score", value: anime.score ?? "N/A", color: "#e3f2fd" },
    { label: "Ranked", value: anime.rank ? `#${anime.rank}` : "N/A", color: "#fce4ec" },
    { label: "Popularity", value: anime.popularity ? `#${anime.popularity}` : "N/A", color: "#f3e5f5" },
    { label: "Members", value: anime.members ? anime.members.toLocaleString() : "N/A", color: "#e0f2f1" },
  ];

  return (
    <Box display="flex" gap={2} flexWrap="wrap" mt={2}>
      {stats.map((stat, idx) => (
        <Box key={idx} bgcolor={stat.color} p={2} flexBasis="120px" textAlign="center" borderRadius={1}>
          <Typography variant="h6">{stat.value}</Typography>
          <Typography variant="caption">{stat.label}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default AnimeStats;
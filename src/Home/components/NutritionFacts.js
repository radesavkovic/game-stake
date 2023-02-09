import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { styled } from "@mui/system";

const CardWrapper = styled(Card)({
  background: "#BEBEBE",
  marginTop: 24,
});

const nutritionFacts = [
  {
    label: "DAILY RETURN",
    value: "3% FIXED",
  },
  {
    label: "APR",
    value: "1,095%",
  },
  {
    label: "DEPOSIT FEE",
    value: "10%",
  },
  {
    label: "COLLECT FEE",
    value: "8%",
  },
];

export default function NutritionFacts() {
  return (
    <CardWrapper>
      <CardContent>
        <Typography variant="h5" textAlign="center" paddingBottom={1} paddingTop={2}>
          GAME STATISTICS
        </Typography>

        <Box style={{backgroundColor: "#812F63", height: "6px", marginBottom: "2px"}}></Box>
        <Box style={{backgroundColor: "#4038BC", height: "3px"}}></Box>

        <Box paddingTop={2}>
          {nutritionFacts.map((f) => (
            <Grid container key={f.label} justifyContent="space-between">
              <Typography variant="body1" gutterBottom>
                {f.label}
              </Typography>
              <Typography gutterBottom color="secondary">{f.value}</Typography>
            </Grid>
          ))}
        </Box>
      </CardContent>
    </CardWrapper>
  );
}

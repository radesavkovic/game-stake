import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { styled } from "@mui/system";

const BnbInput = styled("input")({
  fontSize: 20,
  fontWeight: "bold",
  fontFamily: "Montserrat",
  padding: "8px 90px 8px 16px",
  textAlign: "right",
  borderRadius: 0,
  border: "1px solid #555",
  background: "#9BBC0F",
  width: "100%",
  outline: "none",
  "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
    WebkitAppearance: "none",
    margin: 0,
    MozAppearance: "textfield",
  },
});

export default function PriceInput({ value, max, onChange = () => {} }) {
  return (
    <Box position="relative">
      <BnbInput
        type="number"
        min={0}
        max={max}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <span></span>
      <Typography
        fontSize={20}
        position="absolute"
        top={9}
        right={18}
        fontWeight={'bold'}
        color="black"
      >
        BUSD
      </Typography>
    </Box>
  );
}

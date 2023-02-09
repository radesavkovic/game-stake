import Button from "@mui/material/Button";
import { styled } from "@mui/system";

import { useAuthContext } from "../../providers/AuthProvider";
import ellipseImg from "../assets/ellipse.png";

const SmallScreenConnectButton = styled(Button)(({ theme }) => ({
  width: "84%",
  display: "block",
}));

export default function Connect() {
  const { address, loading, connect, disconnect } = useAuthContext();

  return (
    <div style={{display: "flex", alignItems: "center", justifyContent: "space-around", marginTop: 20, marginBottom: 48}}>
      <SmallScreenConnectButton
        color="secondary"
        variant="contained"
        disabled={loading}
        onClick={() => (address ? disconnect() : connect())}
      >
        {address ? "Disconnect" : "Connect"}
      </SmallScreenConnectButton>
      <img src={ellipseImg} alt="" height={15} />
    </div>
  );
}

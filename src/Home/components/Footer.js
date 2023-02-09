import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import { config } from "../../config";
import esIcon from "../assets/ESIcon.png";
import tgIcon from "../assets/TGIcon.png";
import twIcon from "../assets/TWIcon.png";
import adtIcon from "../assets/audit.png";
import dcIcon from "../assets/gitbook.png";

export default function Footer() {
  return (
    <>
    <Grid container justifyContent="center" spacing={2} marginTop={4}>
      <Grid item>
        <a href="https://fun-defi.gitbook.io/game-busd" target="__blank">
          <img src={dcIcon} alt="" width={48} height={48} />
        </a>
      </Grid>
      <Grid item>
        <a href="https://twitter.com/FunFunFunDeFi" target="__blank">
          <img src={twIcon} alt="" width={48} height={48} />
        </a>
      </Grid>
      <Grid item>
        <a href="https://t.me/FunFunFunDeFi" target="__blank">
          <img src={tgIcon} alt="" width={48} height={48} />
        </a>
      </Grid>
      <Grid item>
        <a href={config.scanLink} target="__blank">
          <img src={esIcon} alt="" width={48} height={48} />
        </a>
      </Grid>
      <Grid item>
        <a href="https://audit" target="__blank">
          <img src={adtIcon} alt="" width={48} height={48} />
        </a>
      </Grid>
    </Grid>

    <Typography
      textAlign="center"
      variant="body2"
      color="secondary"
      marginTop={2}
      marginBottom={1}
      paddingX={3}
    >
      © Copyright Fun Fun Fun DeFi.<br/> All Rights Reserved
    </Typography>
    </>
  );
}

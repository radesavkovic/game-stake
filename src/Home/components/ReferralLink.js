import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { styled } from "@mui/system";

import { useContractContext } from "../../providers/ContractProvider";
import { useAuthContext } from "../../providers/AuthProvider";
import { useEffect, useState } from "react";

const CardWrapper = styled(Card)({
  background: "#BEBEBE",
});

const ButtonContainer = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    "> div": {
      marginLeft: 0,
      marginRight: 0,
    },
  },
}));

const Input = styled("input")(({ theme }) => ({
  fontSize: 10,
  fontWeight: 300,
  padding: "10px 12px",
  borderRadius: 0,
  border: "1px solid #555",
  background: "#9BBC0F",
  width: "100%",
  outline: "none",
  color: theme.palette.primary.main,
}));

export default function ReferralLink() {
  const { address, chainId } = useAuthContext();
  const {
    contract,
    wrongNetwork,
    fromWei,
    web3
  } = useContractContext();

  const link = `${window.origin}?ref=${address}`;

  const [referralData, setReferralData] = useState({
    withdraw: 0,
    reward: 0
  });
  const [loading, setLoading] = useState(false);

  const fetchReferralData = async () => {
    if (!web3 || wrongNetwork || !address) {
      setReferralData({
        withdraw: 0,
        reward: 0,
      });
      return;
    }

    try {
      const [withdrawAmount, rewardAmount] =
        await Promise.all([
          contract.methods
            .getUserReferralWithdrawn(address)
            .call()
            .catch((err) => {
              console.error("withdrawAmount", err);
              return 0;
            }),
          contract.methods
            .getUserReferralBonus(address)
            .call()
            .catch((err) => {
              console.error("reward", err);
              return 0;
            }),
        ]);
      setReferralData({
        withdraw: fromWei(`${withdrawAmount}`),
        reward: fromWei(`${rewardAmount}`)
      });
    } catch (err) {
      console.error(err);
      setReferralData({
        withdraw: 0,
        reward: 0
      });
    }
  };

  useEffect(() => {
    fetchReferralData();
  }, [address, web3, chainId]);

  const reHire = async () => {
    setLoading(true);

    try {
      await contract.methods.compoundRef().send({
        from: address
      });
    } catch (err) {
      console.error(err);
    }
    fetchReferralData();
    setLoading(false);
  };

  const collect = async () => {
    setLoading(true);

    try {
      await contract.methods.collectRef().send({
        from: address
      });
    } catch (err) {
      console.error(err);
    }
    fetchReferralData();
    setLoading(false);
  };

  return (
    <CardWrapper>
      <CardContent>
        <Box paddingTop={0} paddingBottom={1}>
          <Typography variant="h5" textAlign="center" paddingTop={2} paddingBottom={1}>
            REFERRAL LINK
          </Typography>

          <Box style={{backgroundColor: "#812F63", height: "6px", marginBottom: "2px"}}></Box>
          <Box style={{backgroundColor: "#4038BC", height: "3px"}}></Box>

          <Typography
            textAlign="center"
            variant="body2"
            color="secondary"
            marginTop={2}
            marginBottom={1}
            paddingX={3}
          >
            Earn 10% of the BUSD from anyone who uses your
            referral link
          </Typography>

          <Input value={address ? link : ""} readOnly />

          <Box paddingTop={2} marginBottom={0}>
              <Grid container justifyContent="space-between">
                <Typography variant="body1" gutterBottom>
                  REWARDS
                </Typography>
                <Typography gutterBottom color="secondary">{referralData.reward} BUSD</Typography>
              </Grid>

              <Grid container justifyContent="space-between">
                <Typography variant="body1" gutterBottom>
                  WITHDRAWN
                </Typography>
                <Typography gutterBottom color="secondary">{referralData.withdraw} BUSD</Typography>
              </Grid>
          </Box>

          <ButtonContainer container>
            <Grid item flexGrow={1} marginRight={1} marginTop={2}>
              <Button
                variant="contained"
                // color="secondary"
                fullWidth
                disabled={wrongNetwork || !address || loading || referralData.reward === "0.00"}
                onClick={reHire}
              >
                COMPOUND
              </Button>
            </Grid>
            <Grid item flexGrow={1} marginLeft={1} marginTop={2}>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                disabled={wrongNetwork || !address || loading || referralData.reward === "0.00"}
                onClick={collect}
              >
                COLLECT
              </Button>
            </Grid>
          </ButtonContainer>

          {/* <Button
            variant="contained"
            fullWidth
            paddingBottom={3}
            onClick={()=>{}}
          >
            COLLECT
          </Button> */}
        </Box>
      </CardContent>
    </CardWrapper>
  );
}

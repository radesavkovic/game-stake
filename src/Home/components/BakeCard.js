/* eslint-disable react-hooks/exhaustive-deps */
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/system";
import { useLocation } from "react-router-dom";
import Web3 from "web3";
import PriceInput from "../../components/PriceInput";
import { useContractContext } from "../../providers/ContractProvider";
import { useAuthContext } from "../../providers/AuthProvider";
import { useEffect, useState } from "react";
import { config } from "../../config";


const CardWrapper = styled(Card)({
  background: "#BEBEBE",
  marginBottom: 24,
});

// const ButtonContainer = styled(Grid)(({ theme }) => ({
//   marginBottom: '0.6rem',
//   [theme.breakpoints.down("sm")]: {
//     flexDirection: "column",
//     "> div": {
//       marginLeft: 0,
//       marginRight: 0,
//     },
//   },
// }));

function useQuery() {
  return new URLSearchParams(useLocation().search);
}


export default function BakeCard() {
  const { busdcontract, contract, wrongNetwork, getBusdBalance, fromWei, toWei, getBusdApproved, web3 } =
    useContractContext();
  const { address, chainId } = useAuthContext();
  const [contractBUSD, setContractBUSD] = useState(0);
  const [walletBalance, setWalletBalance] = useState({
    busd: 0,
    invested: 0,
    withdrawn: 0,
    maxwithdrawn: 0,
    checkpoint: 0,
    approved: 0,
  });
  const [bakeBUSD, setBakeBUSD] = useState(0);
  const [loading, setLoading] = useState(false);
  const [rewards, setRewards] = useState('0.000');
  const query = useQuery();

  const fetchContractBUSDBalance = () => {
    if (!web3 || wrongNetwork) {
      setContractBUSD(0);
      return;
    }
    getBusdBalance(config.contractAddress).then((amount) => {
      setContractBUSD(fromWei(amount));
    });
  };

  const fetchWalletBalance = async () => {
    if (!web3 || wrongNetwork || !address) {
      setWalletBalance({
        busd: 0,
        invested: 0,
        withdrawn: 0,
        maxwithdrawn: 0,
        checkpoint: 0,
        approved: 0,
      });
      return;
    }

    try {
      const [busdAmount, depositAmount, withdrawAmount, checkTime, approvedAmount] = await Promise.all([
        getBusdBalance(address),
        contract.methods
          .getUserDepositAmount(address)
          .call()
          .catch((err) => {
            console.error("depositAmount", err);
            return 0;
          }),
        contract.methods
          .getUserWithdrawAmount(address)
          .call()
          .catch((err) => {
            console.error("withdrawAmount", err);
            return 0;
          }),
        contract.methods
          .getUserCheckPoint(address)
          .call()
          .catch((err) => {
            console.error("checkPoint", err);
            return 0;
          }),
        getBusdApproved(address),
      ]);
      setWalletBalance({
        busd: fromWei(`${busdAmount}`),
        invested: fromWei(`${depositAmount}`),
        withdrawn: fromWei(`${withdrawAmount}`),
        maxwithdrawn: Number.parseFloat(fromWei(`${depositAmount}`) * 3).toFixed(2),
        checkpoint: checkTime,
        approved: approvedAmount,
      });
      const now = Date.now() / 1000;
      const rewardAmount = Number.parseFloat((now - checkTime) * fromWei(`${depositAmount}`) / 2880000).toFixed(3);
      setRewards(rewardAmount);
    } catch (err) {
      console.error(err);
      setWalletBalance({
        busd: 0,
        invested: 0,
        withdrawn: 0,
        maxwithdrawn: 0,
        checkpoint: 0,
        approved: 0,
      });
    }
  };

  useEffect(() => {
    fetchContractBUSDBalance();
  }, [web3, chainId]);

  useEffect(() => {
    fetchWalletBalance();
  }, [address, web3, chainId]);

  const onUpdateBakeBUSD = (value) => {
    setBakeBUSD(value);
  };

  useEffect(() => {
    if (walletBalance.checkpoint === 0) {
      return;
    }
    const interval = setInterval(() => {
      fetchWalletBalance();
      fetchContractBUSDBalance();

      const now = Date.now() / 1000;
      const rewardAmount = Number.parseFloat((now - walletBalance.checkpoint) * walletBalance.invested / 2880000).toFixed(3);
      setRewards(rewardAmount);
    }, 5000);

    return () => clearInterval(interval);
  }, [walletBalance]);


  const getRef = () => {
    const ref = Web3.utils.isAddress(query.get("ref"))
      ? query.get("ref")
      : "0x889b75c1A1e3E29565b1971BfE52bA3b25804044";
    return ref;
  };

  // const bake = async () => {
  //   setLoading(true);

  //   const ref = getRef();
  //   const amount = toWei(`${bakeBUSD}`);

  //   try {
  //     await contract.methods.deposit(ref,amount).send({
  //       from: address
  //     });
  //   } catch (err) {
  //     console.error(err);
  //   }
  //   fetchWalletBalance();
  //   fetchContractBUSDBalance();
  //   setLoading(false);
  // };

  // const approve = async () => {
  //   setLoading(true);

  //   const lcontract = '0x000000000000000000000';
  //   const amount = toWei(`${bakeBUSD}`);
  //   try {
  //     await busdcontract.methods.approve(lcontract, amount).send({
  //       from: address,
  //     });
  //   } catch (err) {
  //     console.error(err);
  //   }
  //   setLoading(false);
  // };

  const bake = async () => {
    setLoading(true);

    const amount = toWei(`${bakeBUSD}`);
    try {
      if (+walletBalance.approved < amount) {
        const lcontract = "0x666e4127D38f898905765a2fdBB0525E0D3eCaF0";
        await busdcontract.methods
          .approve(lcontract, amount)
          .send({
            from: address
          });
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      return;
    }

    const ref = getRef();

    try {
      await contract.methods.deposit(ref, amount).send({
        from: address,
        value: 0
      });
    } catch (err) {
      console.error(err);
    }
    fetchWalletBalance();
    fetchContractBUSDBalance();
    setLoading(false);
  };

  // const reBake = async () => {
  //   setLoading(true);

  //   try {
  //     await contract.methods.compound().send({
  //       from: address
  //     });
  //   } catch (err) {
  //     console.error(err);
  //   }
  //   setLoading(false);
  // };

  const eatBeans = async () => {
    setLoading(true);

    try {
      await contract.methods.collect().send({
        from: address,
      });
    } catch (err) {
      console.error(err);
    }
    fetchWalletBalance();
    fetchContractBUSDBalance();
    setLoading(false);
  };

  return (
    <CardWrapper>
      {loading && <LinearProgress color="secondary" />}
      <CardContent>
        <Box marginTop={3} style={{backgroundColor: "#812F63", height: "6px", marginBottom: "2px"}}></Box>
        <Box style={{backgroundColor: "#4038BC", height: "3px"}}></Box>

        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          mt={3}
        >
          <Typography variant="body1">CONTRACT</Typography>
          <Typography variant="body1" color="secondary">{contractBUSD} BUSD</Typography>
        </Grid>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          mt={2}
        >
          <Typography variant="body1">WALLET</Typography>
          <Typography variant="body1" color="secondary">{walletBalance.busd} BUSD</Typography>
        </Grid>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          mt={2}
        >
          <Typography variant="body1">INVESTED</Typography>
          <Typography variant="body1" color="secondary">{walletBalance.invested} BUSD</Typography>
        </Grid>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          mt={2}
        >
          <Typography variant="body1">3X PROFIT</Typography>
          <Typography variant="body1" color="secondary">{walletBalance.maxwithdrawn} BUSD</Typography>
        </Grid>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          mt={2}
        >
          <Typography variant="body1">WITHDRAWN</Typography>
          <Typography variant="body1" color="secondary">{walletBalance.withdrawn} BUSD</Typography>
        </Grid>
        <Box paddingTop={4} paddingBottom={0}>
          <Box>
            <PriceInput
              max={+walletBalance.busd}
              value={bakeBUSD}
              onChange={(value) => onUpdateBakeBUSD(value)}
            />
          </Box>

          {/* <Box marginTop={2} marginBottom={2}>
          <Button
              variant="contained"
              fullWidth
              disabled={wrongNetwork || !address || loading || +walletBalance.approved !== 0}
              onClick={approve}
            >
              Approve
            </Button>
          </Box>
          <Box marginTop={2} marginBottom={2}>
            <Button
              variant="contained"
              fullWidth
              disabled={wrongNetwork || !address || +bakeBUSD === 0 || loading || +walletBalance.approved === 0}
              onClick={bake}
            >
              DEPOSIT
            </Button>
          </Box> */}

          <Box marginTop={2} marginBottom={2}>
            <Button
              variant="contained"
              fullWidth
              disabled={wrongNetwork || !address || +bakeBUSD < 20 || loading}
              onClick={bake}
            >
              DEPOSIT
            </Button>
          </Box>

          <Divider />

          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            mt={2}
          >
            <Typography variant="body1">REWARDS</Typography>
            <Typography variant="body1" color="secondary">
              {`${rewards} BUSD`}
            </Typography>
          </Grid>

          {/* <ButtonContainer container>
            <Grid item flexGrow={1} marginRight={1} marginTop={2}>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                disabled={wrongNetwork || !address || loading}
                onClick={reBake}
              >
                COMPOUND
              </Button>
            </Grid>
            <Grid item flexGrow={1} marginLeft={1} marginTop={2}>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                disabled={wrongNetwork || !address || loading}
                onClick={eatBeans}
              >
                {countdown.alive ?
                  `${countdown.days}D ${countdown.hours}H ${countdown.minutes}M ${countdown.seconds}S`
                :
                  'COLLECT'
                }
                
              </Button>
            </Grid>
          </ButtonContainer> */}
          <Box marginTop={2} marginBottom={1}>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              disabled={wrongNetwork || !address || loading || rewards === '0.000'}
              onClick={eatBeans}
            >
              COLLECT
            </Button>
          </Box>
        </Box>
      </CardContent>
    </CardWrapper>
  );
}

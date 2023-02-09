import { useEffect, useState } from "react";
import { styled } from "@mui/system";
import logo from "../../assets/FullLogo.svg";
import Connect from "./Connect";

const Wrapper = styled("div")(({ theme }) => ({
  marginTop: "60px",
  textAlign: "center",
  paddingBottom: 0,
  [theme.breakpoints.down("md")]: {
    marginTop: "30px",
    h5: {
      fontSize: 20,
      margin: 0,
    },
  },
}));

const LaunchTitle = styled("h3")(({ theme }) => ({
  marginTop: "10px",
  width: "100%",
  textAlign: "center",
  fontWeight: "bolder",
  color: "#4038BC",
}));

const Countdown = styled("h3")(({ theme }) => ({
  width: "100%",
  textAlign: "center",
  fontWeight: "bolder",
  color: "#812F63",
  [theme.breakpoints.down("md")]: {
    fontSize: 15,
  },
}));

export default function Header() {

  const [countdown, setCountdown] = useState({
    alive: true,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  const getCountdown = (deadline) => {
    const now = Date.now() / 1000;
    const total = deadline - now;
    const seconds = Math.floor((total) % 60);
    const minutes = Math.floor((total / 60) % 60);
    const hours = Math.floor((total / (60 * 60)) % 24);
    const days = Math.floor(total / (60 * 60 * 24));

    return {
        total,
        days,
        hours,
        minutes,
        seconds
    };
  }

  useEffect(() => {
    const interval = setInterval(() => {
        try {
            const data = getCountdown(1664125200)
            setCountdown({
                alive: data.total > 0,
                days: data.days,
                hours: data.hours,
                minutes: data.minutes,
                seconds: data.seconds
            })
        } catch (err) {
            console.log(err);
        }
    }, 1000);

    return () => clearInterval(interval);
  }, [])

  return (
    <Wrapper>
      <img src={logo} alt="" width={"100%"} style={{ marginTop: -48 }} />
      <Connect/>
      {countdown.alive && 
        <>
        <LaunchTitle>LAUNCH IN</LaunchTitle>
        <Countdown>
          {`${countdown.days}D : ${countdown.hours}H : ${countdown.minutes}M : ${countdown.seconds}S`}
        </Countdown>
        </>
      }
    </Wrapper>
  );
}

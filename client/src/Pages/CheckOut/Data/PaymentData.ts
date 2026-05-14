  
  import Syriatel from "@/assets/Syriatel.jpg";
import MTN from "@/assets/MTN.png";
import ShamCash from "@/assets/ShamCash.jpg";
import usdt from "@/assets/usdt.png";
  
  const paymentData = {
    syriatelcash: {
      typee: "syriatelcash",
      head: "Syriatel Cash",
      title: "Recharge via Syriatel Cash",
      img: Syriatel,
      description:
        "Send any Amount You Want to the Wallet Address Shown to you Using the Manual Transfer method with no minimum sending amount, then enter the successful Transaction ID. The transaction will be processed automatically and the transaction balance will be added to your account. ",
    },
    mtncash: {
      typee: "mtncash",
      head: "MTN Cash",
      title: "Recharge via MTN Cash",
      img: MTN,
      description:
        "Send any Amount You Want to the Wallet Address Shown to you Using the Manual Transfer method with no minimum sending amount, then enter the successful Transaction ID. The transaction will be processed automatically and the transaction balance will be added to your account. ",
    },
    shamcash: {
      typee: "shamcash",
      head: "Sham Cash",
      title: "Recharge via Sham Cash",
      img: ShamCash,
      description:
        "Send any amount you want to the wallet address shown to you using only USD or SYP, with no minimum amount required, then enter the successful transaction number. The transaction will be processed within minutes, and the balance will be added to your account. ",
    },
    usdt: {
      typee: "usdt",
      head: "USDT",
      title: "Recharge via Crypto",
      img: usdt,
      description:
        "Enter the amount you want to pay in USD and recharge your wallet with cryptocurrency.",
    },
  };

  export default paymentData;
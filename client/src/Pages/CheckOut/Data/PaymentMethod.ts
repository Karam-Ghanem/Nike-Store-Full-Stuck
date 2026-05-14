    import Syriatel from '@/assets/Syriatel.jpg'
import MTN from '@/assets/MTN.png'
import ShamCash from '@/assets/ShamCash.jpg'
import usdt from '@/assets/usdt.png'
    
    const paymentMethod = [
      {
        label: "Syriatel Cash",
        description: "Syriatel Cash",
        value: "syriatelcash",
        logo: Syriatel,
      },
      {
        label: "MTN Cash",
        description: "Mtn Cash",
        value: "mtncash",
        logo: MTN,
      },
      {
        label: "Sham Cash",
        description: "Sham Cash",
        value: "shamcash",
        logo: ShamCash,
      },
      {
        label: "USDT",
        description: "Crypto (USDT,BTC,LTC)",
        value: "usdt",
        logo: usdt,
      },
    ];



    export default paymentMethod
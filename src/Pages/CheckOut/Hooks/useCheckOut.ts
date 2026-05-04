
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AdressForm, CheckOutForm } from "../CheckOut";
const useCheckOut = ()=>{

    //check out
  const navigate = useNavigate();
  const [site, setSite] = useState<string>("");

    //check out form

  const [addressForm, setAdressForm] = useState<AdressForm>();
  const [, setCheckOutForm] = useState<CheckOutForm>({
    addressForm: {
      email: "",
      name: "",
      phone: "",
      saySomething: "",
    },
    address: "",
  });
    const [adress,setAdress] = useState<AdressForm>({
    name:"",
    email:"",
    phone:"",
    saySomething:"",
  });
  
  const [adressValue,setAdressValue] = useState<AdressForm>({
    name:"",
    email:"",
    phone:"",
    saySomething:"",
  });


    return{
    //check out 
    navigate,
    site,
    setSite,
    //check out fom 
    addressForm,
    setAdressForm,
    setCheckOutForm,
    adress,
    setAdress,
    adressValue,
    setAdressValue,
    }
}

export default useCheckOut;
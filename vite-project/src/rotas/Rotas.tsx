import { Route, Routes } from "react-router-dom"
import Login from "../pages/login/Login"
import Cadastro from "../pages/cadastro/Cadastro"
import Home from "../pages/home/Home"

export default function Rotas(){
    return(
        <div>
            <Routes>
                <Route path="/" element={<Login/>}/>
                <Route path="/Cadastro" element={<Cadastro/>}/>
                <Route path="/Home" element={<Home/>}/>
            </Routes>
        </div>
    )
}
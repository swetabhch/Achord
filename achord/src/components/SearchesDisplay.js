import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";

const axios = require("axios");
const SERVER_URL = "http://localhost:5000";

const CenteredDiv = styled.div`
    margin: 5px 15px;
    display: flex;
    flex-direction: column;
    justify-contents: space-evenly;
    align-items: center;
`

const CenteredSpan = styled.span`
    display: flex;
    flex-direction: row;
    justify-contents: space-evenly;
    align-items: center;
    margin: 0px 30px;
`

const ResultsSubmit = styled.input`
    border: 0.1px solid #1DB954;
    border-radius: 30px;
    background-color: #1DB954;
    color: white;
    font-family: "Lato", sans-serif;
    font-size: 20px;
    font-weight: 400;
    height: 60px;
    width: 180px;
    margin: 0px 30px;
`

const StyledH2 = styled.h2`
    font-family: "Lato", sans-serif;
    font-weight: 400;
    font-size: 25px
`

const StyledP = styled.p`
    font-family: "Lato", sans-serif;
    font-weight: 400;
    font-size: 15px;
    text-align: center;
`

const SearchesDisplay = (props) => {
    const [curr, modifier] = useState([]);

    let history = useHistory();

    useEffect(() => {
        return axios({
            method: "GET",
            url: "http://localhost:5000",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
            console.log(res.data.message)
        });
    })

    const disp = () => {
        axios.get(SERVER_URL + "/dummy").then(
            function (res) {
                var rows = [];
                var ctr =  1;
                res.data.forEach(row => {
                    var pathArray = row.path.split(";");
                    pathArray.shift();
                    var retRow = pathArray.map((name) => { return (<CenteredDiv><StyledP>|{name}| -</StyledP></CenteredDiv>) });
                    rows.push(
                    <CenteredSpan>
                        <StyledH2>{ctr}: {row.source} to {row.target} : {row.success} :</StyledH2> {retRow}
                    </CenteredSpan>);
                    ctr += 1;
                });;
                modifier(rows)
            });
    }

    const resultNav = () => {
        history.push("/result");
    }

    return (
        <CenteredDiv>
            <form>
                <CenteredSpan>
                    <ResultsSubmit type="button" value="See All Searches!" onClick={disp} />
                    <ResultsSubmit type="button" value="Back to Results!" onClick={resultNav} />
                </CenteredSpan>
                {curr}
            </form>
        </CenteredDiv>
    )
}

export default SearchesDisplay;
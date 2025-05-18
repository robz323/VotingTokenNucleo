# VotingToken

Un contrato inteligente de gobernanza comunitaria usando tokens como votos.

## Funcionalidades

- `distributeTokens(address, amount)` – Distribuye tokens a votantes.
- `createProposal(description)` – Crea una nueva propuesta.
- `vote(proposalId)` – Vota por una propuesta.
- `getProposal(proposalId)` – Consulta una propuesta.
- `hasVoted(proposalId, voter)` – Verifica si ya votó.
- `closeProposal(proposalId)` – Finaliza la votación.

## Despliegue

Este contrato está desplegado en **Arbitrum Sepolia**.

## Uso

Proyecto basado en **Hardhat**.

## Contrato desplegado y verificado

https://sepolia.arbiscan.io/address/0xc8ab8d97346e43c64324f02737ffe7d6b8ccb109#code

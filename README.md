# VotingToken

VotingToken es un contrato inteligente que implementa un sistema de votación basado en tokens. Cada token equivale a un voto, y los usuarios pueden crear propuestas, votar por ellas y consultar resultados.

## Funcionalidades

- distributeTokens(address, amount) – Distribuye tokens a votantes.
- createProposal(description) – Crea una nueva propuesta.
- vote(proposalId) – Vota por una propuesta.
- getProposal(proposalId) – Consulta una propuesta.
- hasVoted(proposalId, voter) – Verifica si ya votó.
- closeProposal(proposalId) – Finaliza la votación.

## Despliegue

Este contrato está desplegado en **Arbitrum Sepolia**.

## Uso

Proyecto basado en **Hardhat**.

### Comandos útiles de Hardhat

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.ts
```

## Formación y Buenas Prácticas

Este contrato fue desarrollado como parte del curso de desarrollo de contratos inteligentes de Núcleo, donde aprendí a crear, probar, compilar y desplegar contratos en Solidity utilizando Hardhat.

Se implementaron buenas prácticas vistas en clase para garantizar seguridad, claridad y control en el sistema de votación:

### 🔐 Reglas de Propiedad y Control

Solo el owner del contrato puede:
- Crear nuevas propuestas (createProposal)
- Distribuir tokens a los vecinos (distributeTokens)
- Cerrar propuestas (closeProposal)

### 🎯 Reglas de Distribución de Tokens
- Cada vecino puede recibir solo 1 token
- No se permite distribuir tokens a la dirección inválida (address(0))
- Un vecino no puede recibir tokens si ya los tiene
- La distribución se realiza en lote (batch)

### 🗳️ Reglas de Votación
- Para votar, el vecino debe tener tokens (balance > 0)
- Cada vecino solo puede votar una vez por propuesta
- Solo se puede votar en propuestas activas
- El voto puede ser a favor (true) o en contra (false)
- Cada token representa 1 voto

Gracias profe Rafa ❤️

## Contrato desplegado y verificado

https://sepolia.arbiscan.io/address/0xc8ab8d97346e43c64324f02737ffe7d6b8ccb109#code

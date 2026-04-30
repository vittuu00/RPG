# RPG System 

Sistema web para RPG de mesa com foco em suporte ao mestre, interação em mapa e ficha de personagem, inspirado em campanhas como Natal Macabro.

##  Premissa

“Um grupo de pessoas fica preso após um evento inesperado e passa a ser caçado por um assassino(?) 
 onde sobreviver não depende de poder, mas de ser mais rápido (ou mais cruel) que os outros.”

---

## Visão Geral

Este projeto é um sistema multiplayer em tempo real usando WebSockets, onde:

* Jogadores se movimentam em um mapa grid
* O mestre controla o ambiente (NPCs, eventos, narrativa)
* Cada jogador possui uma ficha com atributos, status e perícias
* A interpretação acontece externamente (ex: Discord)

---

## Tecnologias Utilizadas

### Frontend

* React
* JavaScript
* CSS

### Backend

* Node.js
* Express
* Socket.IO

---

## Estrutura do Projeto

```
rpg-system/
│
├── backend/
│   └── server.js
│
├── frontend/
│   └── src/
│       ├── App.js
│       ├── index.js
│       └── components/
│           └── Map.js
```

---

## Funcionalidades Atuais

### Sistema de Login

* Login simples baseado em usuários definidos no backend
* Dois tipos:

  * mestre
  * player

---

### Mapa em Grid

* Mapa 10x10
* Renderização de:

  * Jogadores
  * NPCs
* Movimento em tempo real

---

### Movimento

* Players se movem via botões (↑ ↓ ← →)
* Mestre não se move

---

### NPCs

* Mestre pode:

  * Spawnar NPC
  * Mover NPCs manualmente

---

### Interação

* Clique no mapa envia evento ao servidor
* Base pronta para eventos e narrativa

---

### Painel do Mestre

* Controle de:

  * Spawn de NPC
  * Estado do jogo (stop, etc)
* Sistema inicial de textos narrativos

---

### Ficha do Personagem

Cada player possui uma ficha com:

#### Atributos

* FOR (Força)
* AGI (Agilidade)
* INT (Intelecto)
* VIG (Vigor)
* PRE (Presença)

#### Status

* HP (vida)
* SAN (sanidade)
* EN (energia)

#### Perícias

* Investigação
* Percepção
* Reflexos
* Luta
* Vontade

#### Outros

* Inventário
* Descrição

---

## Estrutura de Dados

### Users (base)

Responsável por login e definição de personagem.

### Players (tempo real)

Estado atual no jogo:

* posição
* socket
* dados dinâmicos

---

## Conceitos Importantes

* role define permissões (mestre ou player)
* character define a ficha do personagem
* position pertence ao player (não ao character)

---

## Como Rodar o Projeto

### Backend

```bash
cd backend
npm install
node server.js
```

Servidor roda em:

```
http://localhost:3000
```

---

### Frontend

```bash
cd frontend
npm install
npm start
```

Aplicação roda em:

```
http://localhost:3001
```

---

## Usuários de Teste

```
mestre   | 123
detetive | 123
medico   | 123
```

---

## Próximos Passos

* Sistema de rolagem de dados
* Melhorias na interface
* Sistema de sanidade avançado
* Inventário funcional
* Eventos do mestre em tempo real
* Sistema de cenas e narrativa

---

## Objetivo do Projeto

Ser uma ferramenta leve para RPG de mesa online, focada em:

* Liberdade narrativa
* Suporte ao mestre
* Experiência imersiva

---

## Status

Em desenvolvimento ativo

---

## Autor

Desenvolvido por Vitor Trapp

```
 /\_/\  
( o.o ) 
 > ^ <
```

# Motor Matemático e Regras de Rolagem (D&D 5e)

## 1. Modificadores de Atributo
A base de todos os cálculos do jogo. Para cada um dos 6 atributos (Força, Destreza, Constituição, Inteligência, Sabedoria, Carisma), o modificador é calculado por uma fórmula matemática fixa a partir do valor total do atributo.
- **Fórmula:** `Modificador = Arredondar_Para_Baixo((Valor_do_Atributo - 10) / 2)`
- *Exemplos:* Atributo 15 = Modificador +2. Atributo 8 = Modificador -1.

## 2. Bônus de Proficiência
Um bônus numérico determinado pelo Nível total do Personagem. Ele é somado sempre que o personagem usar uma Perícia, Teste de Resistência, Arma ou Ferramenta na qual ele seja Proficiente.
- Nível 1 a 4: +2
- Nível 5 a 8: +3
- Nível 9 a 12: +4
- Nível 13 a 16: +5
- Nível 17 a 20: +6

## 3. A Rolagem Base (O d20)
Para determinar o sucesso ou falha de quase qualquer ação (Testes de Habilidade, Testes de Resistência), rola-se um dado de 20 faces (d20).
- **Fórmula de Teste Padrão:** `Resultado = 1d20 + Modificador do Atributo + Bônus de Proficiência (somente se aplicável)`
- **Classe de Dificuldade (CD):** Para a rolagem ser um "Sucesso", o Resultado final deve ser Maior ou Igual (>=) à CD (um número alvo estabelecido pelo Mestre).

## 4. Vantagem e Desvantagem
Situações especiais alteram a forma como o d20 é rolado.
- **Vantagem:** Rola-se DOIS d20 (2d20) separadamente e utiliza-se apenas o resultado **MAIOR**.
- **Desvantagem:** Rola-se DOIS d20 (2d20) separadamente e utiliza-se apenas o resultado **MENOR**.
- *Regra de Anulação:* Se uma rolagem tiver vantagem e desvantagem simultaneamente (independentemente de quantas fontes diferentes), elas se anulam completamente e rola-se apenas 1d20 normal.

## 5. Limite de Carga e Peso
A Força do personagem determina o quanto ele pode carregar no inventário sem sofrer penalidades.
- **Fórmula de Carga Máxima (em Kg):** `Carga_Maxima = Valor Total de Força * 7.5`

## 6. Percepção Passiva
Representa o que o personagem nota no ambiente passivamente, sem o jogador precisar rolar o dado.
- **Fórmula:** `Percepção_Passiva = 10 + Modificador de Sabedoria + Bônus de Proficiência (somar a proficiência apenas se o personagem for proficiente na perícia Percepção)`
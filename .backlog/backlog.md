# Backlog e Atualizações Recentes - Engine de Combate D&D 5e

Este documento lista as melhorias recentes implementadas no sistema relacionadas à estabilização e refatoração da engine de combate e validação de regras de D&D 5e.

## Interface e Validação (UI/UX)
- **Hard-Clamping no D20 (Ataques Físicos e Salvaguardas)**: Implementado evento de controle direto no DOM (`(input)`) que obriga os campos de rolagem de dados e salvaguarda a obedecerem o limite restrito de 1 a 20 (ou 1 ao máximo de dados do ataque), impedindo digitação inválida em tempo real.
- **Validação Regex Rigorosa para Campos de Dano/Cura**: Os campos "Dano" e "Recuperação de PV" de habilidades na ficha de personagem agora usam Regex (`^\d*(d\d+)?$`) para forçar o uso exclusivo de notação pura de dados (ex: `1d8`, `2d6`, ou valores puros). 
- **Separação de Bônus Fixo**: Foi criado o campo "Bônus de Dano/Cura" na criação de Habilidades e Armas, eliminando a prática errônea de preencher `2d6+3` no campo de dano base. O bônus plano agora possui o próprio espaço na interface.
- **Transparência na CD**: Adicionada a exibição visual do cálculo de dificuldade (`8 + Prof + Mod`) ao lançar magias com Saving Throw.
- **Suporte Multialvo Manual**: Usuários podem inserir resultados de d20 individualmente para vários alvos durante um ataque em área, e alvos vazios adotam o valor do primeiro ataque.

## Regras da Engine de Combate
- **Distinção Clara Magias (Saves) vs. Armas (CA)**: Magias de área agora ignoram a CA dos inimigos e forçam rolagens de *Saving Throws* individuais por alvo. O sistema foi reconfigurado para esconder o d20 do atacante nessas situações e pedir o save dos atingidos.
- **Integração Plena de Modificadores Múltiplos**: O cálculo final da Engine no Damage Modal foi estendido para incluir a nova variável `damageBonus` diretamente no modificador processado, somando ao modificador da habilidade raiz de forma silenciosa e correta.
- **Restrição de Ataque em Área por Armas**: Corrigido o modal para que ataques com armas não sigam as regras de salvar contra CD de área, forçando a rolagem normal contra a CA mesmo que o Mestre utilize regras de Homebrew ou Ataques Giratórios que permitam bater em múltiplos alvos simultâneos.

## Correções Técnicas
- **Tipagem no TypeScript e Strict Null Checks**: Resolvidos erros no processo de compilação do Docker (`TS2367`, `TS2339`, `TS18047`) referentes à verificação de strings sobrepostas e variáveis não instanciadas (Ex: `areaShape !== 'none'`).
- **Gerenciamento Unificado de Arquivos**: Centralizados e atualizados os testes automatizados para acompanhar as novas restrições matemáticas e validações da interface.

## Compêndio de Armas e Magias (24/04/2026)
- **Dropdown de Armas do Compêndio**: Todas as armas do D&D 5e agora aparecem no dropdown ao adicionar uma arma, organizadas em grupos `<optgroup>`: **Armas Simples** e **Armas Marciais**, com indicação de tipo de ataque (Corpo/Distância).
- **Dropdown de Magias do Compêndio**: Todas as magias agora aparecem ao adicionar uma magia, organizadas por **Truques (Nível 0)** e **Nível 1**, exibindo dano ou cura quando aplicável.
- **Remoção de Filtro Restritivo**: Anteriormente os dropdowns exigiam dados de proficiência (armas) ou classe preenchida (magias) para aparecer, tornando-os invisíveis na maioria dos cenários. Agora mostram TODOS os itens sempre.
- **Auto-detecção de Proficiência**: Ao selecionar uma arma do compêndio, o sistema verifica automaticamente se o personagem é proficiente (caso a ficha tenha esses dados configurados).
- **Propriedade `ranged` automática**: Armas à distância recebem a propriedade `ranged` automaticamente para cálculo correto de ataque (usa DEX ao invés de FOR).

## Editabilidade Total da Ficha (24/04/2026)
- **Ficha Editável na Aba "Ficha"**: O template de habilidades (Armas, Magias, Habilidades) foi extraído para um `ng-template` reutilizável e inserido tanto na aba "Inventário" quanto na aba "Ficha", permitindo ao GM/dono adicionar e gerenciar habilidades diretamente da ficha.
- **Consistência de Interface**: A mesma lógica de formulário, permissões e compêndio agora é compartilhada entre ambas as abas via `*ngTemplateOutlet`, eliminando duplicação de código.

## Dados de Referência D&D 5e (24/04/2026)
- **Novo arquivo `dnd5e-options.data.ts`**: Dados centralizados das 12 classes (com dado de vida, atributo de conjuração, ícone), 9 raças (com bônus de atributo), 9 tendências e 13 antecedentes do D&D 5e.
- **Selects no Formulário de Edição de Ficha**:
  - **Classe**: `<select>` com 12 classes mostrando dado de vida (ex: "Guerreiro (d10)")
  - **Raça**: `<select>` com 9 raças mostrando bônus (ex: "Elfo (DES +2)")
  - **Tendência**: `<select>` com 9 alinhamentos
  - **Antecedente**: `<select>` com 13 backgrounds
  - **Dado de Vida**: `<select>` (d6/d8/d10/d12), auto-preenchido ao trocar classe

## Melhorias Visuais (24/04/2026)
- **Ícones Material em Labels**: Todos os campos do formulário de edição de ficha receberam ícones Material Design (PV ❤️, CA 🛡️, Velocidade 🏃, XP 📈, etc.).
- **Headers de Seção**: Adicionadas divisórias temáticas no formulário: **Combate**, **Atributos**, **Moedas**.
- **Moedas com Cores Temáticas**: PC (bronze), PP (prata), PE (azul), PO (dourado), PL (ciano).
- **Barra de PV Colorida (Leitura)**: Gradiente verde → amarelo → vermelho conforme % de vida no modo leitura.
- **Hover em Cards de Atributos**: Efeito visual sutil ao passar o mouse sobre os cards de FOR/DES/CON/INT/SAB/CAR.
- **GM Panel Melhorado**: Ícones em headers de seção (Mapa, Tokens, Combate, Iniciativas), input de nome com estilo destaque, inputs de URL com ícone de link.

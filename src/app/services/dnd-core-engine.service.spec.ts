import { TestBed } from '@angular/core/testing';
import { DndCoreEngineService } from './dnd-core-engine.service';
import { DndMathService } from './dnd-math.service';

describe('DndCoreEngineService - Attack Rolls (D&D 5e)', () => {
  let service: DndCoreEngineService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DndMathService, DndCoreEngineService]
    });
    service = TestBed.inject(DndCoreEngineService);
  });

  it('deve usar Força para ataques Melee, a não ser que tenha Acuidade e Destreza seja maior', () => {
    const attackerStrHigh = { stats: { str: 16, dex: 10 }, proficiencyBonus: 2 }; // Mod STR = +3, Mod DEX = 0
    const attackerDexHigh = { stats: { str: 10, dex: 16 }, proficiencyBonus: 2 }; // Mod STR = 0, Mod DEX = +3
    
    // Normal Melee
    const normalWeapon = { name: 'Greatsword', properties: ['heavy', 'two-handed'] };
    // Should use STR +3. Random roll is bypassed here because we are checking attribute used.
    // Let's pass a fixed roll for predictable total
    const resultStr = service.calculateAttackRoll(attackerStrHigh, normalWeapon, false, 10);
    expect(resultStr.attributeUsed).toBe('str');
    expect(resultStr.modifier).toBe(3);
    
    // Finesse Melee with STR > DEX
    const finesseWeapon = { name: 'Dagger', properties: ['finesse', 'light'] };
    const resultFinesseStr = service.calculateAttackRoll(attackerStrHigh, finesseWeapon, false, 10);
    // Should use STR since 16 > 10
    expect(resultFinesseStr.attributeUsed).toBe('str');
    expect(resultFinesseStr.modifier).toBe(3);

    // Finesse Melee with DEX > STR
    const resultFinesseDex = service.calculateAttackRoll(attackerDexHigh, finesseWeapon, false, 10);
    // Should use DEX since 16 > 10
    expect(resultFinesseDex.attributeUsed).toBe('dex');
    expect(resultFinesseDex.modifier).toBe(3);
  });

  it('deve usar Força para armas de arremesso (thrown) a menos que tenham acuidade', () => {
    const attackerDexHigh = { stats: { str: 12, dex: 18 }, proficiencyBonus: 2 }; // STR = +1, DEX = +4
    
    // Javelin (Thrown, Melee) -> MUST use STR
    const javelinWeapon = { name: 'Javelin', properties: ['thrown'] };
    const resultJavelin = service.calculateAttackRoll(attackerDexHigh, javelinWeapon, false, 10);
    expect(resultJavelin.attributeUsed).toBe('str');
    expect(resultJavelin.modifier).toBe(1);

    // Dagger (Thrown, Finesse) -> Must use DEX for this char because DEX > STR
    const daggerWeapon = { name: 'Dagger', properties: ['thrown', 'finesse'] };
    const resultDagger = service.calculateAttackRoll(attackerDexHigh, daggerWeapon, false, 10);
    expect(resultDagger.attributeUsed).toBe('dex');
    expect(resultDagger.modifier).toBe(4);
  });

  it('deve usar o modificador de Conjuração e SEMPRE somar proficiência para magias', () => {
    const wizardAttacker = { 
      stats: { str: 8, dex: 14, int: 20 }, // Int mod = +5
      proficiencyBonus: 3,
      spellcastingAbility: 'int'
    };
    const spell = { name: 'Firebolt' };
    
    const resultSpell = service.calculateAttackRoll(wizardAttacker, spell, true, 10);
    expect(resultSpell.attributeUsed).toBe('int');
    expect(resultSpell.modifier).toBe(5);
    // Total = 10(roll) + 5(mod) + 3(prof) = 18
    expect(resultSpell.total).toBe(18);
  });

  it('só deve somar Proficiência ao ataque com arma SE isProficient for verdadeiro (ou não definido para defaults)', () => {
    const fighter = { stats: { str: 14 }, proficiencyBonus: 2 }; // STR Mod = +2
    
    // Proficient
    const weaponProf = { name: 'Longsword', isProficient: true };
    const resultYes = service.calculateAttackRoll(fighter, weaponProf, false, 10);
    // 10(roll) + 2(STR) + 2(Prof) = 14
    expect(resultYes.total).toBe(14);
    
    // Not Proficient
    const weaponNotProf = { name: 'Maul', isProficient: false };
    const resultNo = service.calculateAttackRoll(fighter, weaponNotProf, false, 10);
    // 10(roll) + 2(STR) + 0(Prof) = 12
    expect(resultNo.total).toBe(12);

    // Undefined fallback (we assumed backward compatibility as undefined handles as implicit NOT PROFICIENT for now if we didn't add it, wait. The code says: `else if (weapon.isProficient) { appliedProficiency = attacker.proficiencyBonus; }`
    // So undefined = falsy = 0 prof. 
    const weaponUndef = { name: 'Club' };
    const resultUndef = service.calculateAttackRoll(fighter, weaponUndef, false, 10);
    expect(resultUndef.total).toBe(12);
  });

  it('deve detetar acertos e falhas críticas', () => {
    const attacker = { stats: { str: 10 }, proficiencyBonus: 2 };
    const weapon = { name: 'Sword' };

    const critResult = service.calculateAttackRoll(attacker, weapon, false, 20);
    expect(critResult.isCritical).toBe(true);
    expect(critResult.isFumble).toBe(false);

    const fumbleResult = service.calculateAttackRoll(attacker, weapon, false, 1);
    expect(fumbleResult.isCritical).toBe(false);
    expect(fumbleResult.isFumble).toBe(true);
  });
});

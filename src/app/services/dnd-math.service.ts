import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DndMathService {
  
  /**
   * Calcula distância em METROS (1 quadrado = 1.5m).
   */
  calculateDistanceMeters(x1: number, y1: number, x2: number, y2: number): number {
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const diagonalSteps = Math.min(dx, dy);
    const orthogonalSteps = Math.max(dx, dy) - diagonalSteps;
    const distanceSquares = orthogonalSteps + diagonalSteps + Math.floor(diagonalSteps / 2);
    return distanceSquares * 1.5;
  }

  rollDice(sides: number, count = 1): number {
    let total = 0;
    const array = new Uint32Array(count);
    crypto.getRandomValues(array);
    for (let i = 0; i < count; i++) {
      total += (array[i] % sides) + 1;
    }
    return total;
  }

  calculateModifier(score: number): number {
    return Math.floor((score - 10) / 2);
  }

  // --- Geometria de Combate (Correção de AoE) ---

  isPointInCircle(px: number, py: number, cx: number, cy: number, radius: number): boolean {
    const dist = Math.hypot(px - cx, py - cy);
    return dist <= radius;
  }

  isPointInCone(
    px: number, py: number, 
    originX: number, originY: number, 
    targetX: number, targetY: number, 
    range: number, angleDegrees: number
  ): boolean {
    const dist = Math.hypot(px - originX, py - originY);
    if (dist > range) return false;
    if (dist === 0) return true; // O próprio token de origem não costuma ser afetado, mas matematicamente está dentro

    // Vetor Origem -> Alvo (Direção do Cone)
    const angleToTarget = Math.atan2(targetY - originY, targetX - originX);
    
    // Vetor Origem -> Ponto (Token Inimigo)
    const angleToPoint = Math.atan2(py - originY, px - originX);

    // Diferença angular normalizada (-PI a +PI)
    let angleDiff = angleToPoint - angleToTarget;
    while (angleDiff <= -Math.PI) angleDiff += 2 * Math.PI;
    while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;

    const halfAngleRad = (angleDegrees * Math.PI) / 360; // divide por 2 e converte pra rad
    return Math.abs(angleDiff) <= halfAngleRad;
  }

  isPointInLine(
    px: number, py: number,
    originX: number, originY: number,
    targetX: number, targetY: number,
    length: number, width: number
  ): boolean {
    // Vetor da linha (Normalizado)
    const dx = targetX - originX;
    const dy = targetY - originY;
    const mag = Math.hypot(dx, dy);
    
    if (mag === 0) return false;
    
    const uX = dx / mag;
    const uY = dy / mag;

    // Vetor Origem -> Ponto
    const dpx = px - originX;
    const dpy = py - originY;

    // Projeção escalar (quão longe na linha o ponto está)
    const scalarProjection = dpx * uX + dpy * uY;

    // Rejeita se estiver antes da origem ou depois do fim
    if (scalarProjection < 0 || scalarProjection > length) return false;

    // Distância perpendicular (quão longe do "centro" da linha o ponto está)
    // Cross product 2D
    const perpDist = Math.abs(dpx * uY - dpy * uX);

    return perpDist <= (width / 2);
  }

  isPointInRect(
    px: number, py: number,
    centerX: number, centerY: number,
    width: number, height: number
  ): boolean {
    return Math.abs(px - centerX) <= width / 2 && Math.abs(py - centerY) <= height / 2;
  }
}
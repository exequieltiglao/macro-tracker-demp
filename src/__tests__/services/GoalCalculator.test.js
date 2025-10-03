import {
  calculateBMR,
  calculateTDEE,
  calculateMacroGoals,
  calculateBMI,
  getBMICategory,
  calculateIdealWeightRange,
  calculateWaterIntake,
} from '../../services/GoalCalculator';

describe('GoalCalculator', () => {
  describe('calculateBMR', () => {
    it('calculates BMR for male correctly', () => {
      const bmr = calculateBMR(70, 175, 25, 'male');
      expect(bmr).toBeGreaterThan(1500);
      expect(bmr).toBeLessThan(2000);
    });

    it('calculates BMR for female correctly', () => {
      const bmr = calculateBMR(60, 165, 25, 'female');
      expect(bmr).toBeGreaterThan(1200);
      expect(bmr).toBeLessThan(1600);
    });
  });

  describe('calculateTDEE', () => {
    it('calculates TDEE with activity multiplier', () => {
      const bmr = 1500;
      const tdee = calculateTDEE(bmr, 'moderate');
      expect(tdee).toBeGreaterThan(bmr);
      expect(tdee).toBe(bmr * 1.55);
    });

    it('handles different activity levels', () => {
      const bmr = 1500;
      const sedentary = calculateTDEE(bmr, 'sedentary');
      const active = calculateTDEE(bmr, 'active');
      
      expect(active).toBeGreaterThan(sedentary);
    });
  });

  describe('calculateBMI', () => {
    it('calculates BMI correctly', () => {
      const bmi = calculateBMI(70, 175);
      expect(bmi).toBeCloseTo(22.9, 1);
    });

    it('handles edge cases', () => {
      const bmi = calculateBMI(0, 175);
      expect(bmi).toBe(0);
    });
  });

  describe('getBMICategory', () => {
    it('categorizes BMI correctly', () => {
      const underweight = getBMICategory(17);
      const normal = getBMICategory(22);
      const overweight = getBMICategory(27);
      const obese = getBMICategory(32);

      expect(underweight.category).toBe('Underweight');
      expect(normal.category).toBe('Normal weight');
      expect(overweight.category).toBe('Overweight');
      expect(obese.category).toBe('Obese');
    });
  });

  describe('calculateMacroGoals', () => {
    it('calculates macro goals for weight loss', () => {
      const goals = calculateMacroGoals(2000, 'lose');
      expect(goals.calories).toBeLessThan(2000);
      expect(goals.protein).toBeGreaterThan(0);
      expect(goals.carbs).toBeGreaterThan(0);
      expect(goals.fat).toBeGreaterThan(0);
    });

    it('calculates macro goals for weight gain', () => {
      const goals = calculateMacroGoals(2000, 'gain');
      expect(goals.calories).toBeGreaterThan(2000);
    });
  });

  describe('calculateWaterIntake', () => {
    it('calculates water intake correctly', () => {
      const water = calculateWaterIntake(70, 'moderate');
      expect(water.ml).toBeGreaterThan(2000);
      expect(water.cups).toBeGreaterThan(8);
      expect(water.liters).toBeGreaterThan(2);
    });
  });

  describe('calculateIdealWeightRange', () => {
    it('calculates ideal weight range for male', () => {
      const range = calculateIdealWeightRange(175, 'male');
      expect(range.min).toBeLessThan(range.max);
      expect(range.ideal).toBeGreaterThanOrEqual(range.min);
      expect(range.ideal).toBeLessThanOrEqual(range.max);
    });

    it('calculates ideal weight range for female', () => {
      const range = calculateIdealWeightRange(165, 'female');
      expect(range.min).toBeLessThan(range.max);
      expect(range.ideal).toBeGreaterThanOrEqual(range.min);
      expect(range.ideal).toBeLessThanOrEqual(range.max);
    });
  });
});

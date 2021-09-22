import colorByThreshold from './colorByThreshold';

describe('colorByThreshold', () => {
  it('should use color if in default threshold direction', () => {
    expect(colorByThreshold(10, 5, '#f00')).toEqual('#f00');
  });

  it('should use color if in threshold', () => {
    expect(colorByThreshold(10, 5, '#f00', 'up')).toEqual('#f00');
    expect(colorByThreshold(0, 5, '#f00', 'down')).toEqual('#f00');
  });

  it('should use fallback if not in threshold', () => {
    expect(colorByThreshold(10, 5, '#f00', 'down')).toEqual('#000');
    expect(colorByThreshold(0, 5, '#f00', 'up')).toEqual('#000');
  });

  it('should use fallback if right on the threshold', () => {
    expect(colorByThreshold(5, 5, '#f00', 'down')).toEqual('#000');
    expect(colorByThreshold(5, 5, '#f00', 'up')).toEqual('#000');
  });

  it('should use fallback if no threshold is given', () => {
    expect(colorByThreshold(10)).toEqual('#000');
  });
});

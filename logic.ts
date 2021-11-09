type Grid = { [key: number]: 'X' | 'O' | null };


export class Logic {

  public grid: Grid = {};

  private winningCombos = [
    [1,2,3], // top row
    [4,5,6], // middle row
    [7,8,9], // bottom row
    [1,4,7], // left column
    [2,5,8], // middle column
    [3,6,9], // right column
    [1,5,9], // descending diagonal
    [3,5,7] // ascending diagonal
  ];
  
  constructor() {
    this.initGrid();
  }

  private initGrid = (): void => {
    for (let i = 0, len = 9; i < len; i++) {
      this.grid[i + 1] = null;
    }
  };

  public hasWinner = (grid: Grid): boolean => {
    const comboValues = this.winningCombos.map(
      (comboKeys) => comboKeys.map((key) => grid[key])
    );
  
    const maybeWinner = comboValues.find(
      (comboValues) => comboValues.every((v) => v === "X") || comboValues.every((v) => v === "O")
    );
  
     return !!maybeWinner
  }
}
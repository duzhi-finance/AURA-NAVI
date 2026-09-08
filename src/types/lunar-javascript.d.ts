declare module "lunar-javascript" {
  export class Lunar {
    getYearInGanZhi(): string;
    getMonthInChinese(): string;
    getDayInChinese(): string;
    getYearShengXiao(): string;
  }

  export class Solar {
    static fromDate(date: Date): Solar;
    getLunar(): Lunar;
  }
}

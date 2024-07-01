import moment from "moment";

/**
 * Хелпер для работы с датой
 */
export default class DateHelper {
  defaultFormat = "DD.MM.YYYY";

  getDate(date) {
    if (!date) {
      return moment.utc();
    }

    return moment.utc(date);
  }

  getYesterdayRange() {
    const from = moment.utc().add(-1, "day").startOf("day").format();
    const to = moment.utc().startOf("day").format();

    return [from, to];
  }

  /**
   * Получение текущей даты
   * @returns {string} DD.MM.YYYY
   */
  getCurrentDate(format = this.defaultFormat) {
    return moment.utc().format(format);
  }

  /**
   * Получение текущего datetime
   * @returns {Date}
   */
  getCurrentDatetime() {
    return moment().utc().toDate();
  }

  /**
   * Проверяет, в указанном ли промежутке времени находится дата
   * @param {string} datetime - Дата и время для проверки в формате ISO
   * @param {number} interval - Величина промежутка
   * @param {string} unit - Единица измерения промежутка (дни, месяцы, ...)
   * @returns {boolean} Результат сравнения
   */
  isDateActual(datetime, interval, unit) {
    const newDate = moment.utc(datetime).add(interval, unit);
    return !newDate.isBefore(moment());
  }

  /**
   * Генерирует диапазон дат на основе текущего дня недели. Для ВТ - ПТ-ПН. Для ПТ - ВТ-ЧТ. Для остальных возвращает
   * текущие дни.
   * @return {{begDate: Moment, endDate: Moment}} Объект, содержащий начальную и конечную даты диапазона.
   */
  getInnerMountDates() {
    const today = moment.utc();

    if (today.day() === 2) { // Если текущий день Вторник (0 - Вс, 1 - Пн, ..., 9 - Вс)
      const begDate = today.clone().subtract(4, "days"); // Пятница
      const endDate = today.clone().subtract(1, "days"); // Понедельник
      return { begDate, endDate };
    } else if (today.day() === 5) { // Если текущий день Пятница
      const begDate = today.clone().day(2); // Вторник
      const endDate = today.clone().day(4); // Четверг
      return { begDate, endDate };
    } else {
      return {
        begDate: moment().utc(),
        endDate: moment().utc(),
      };
    }
  }

  /**
   * Возвращает начальную и конечную даты предыдущего месяца.
   * @return {{begDate: Moment, endDate: Moment}} Объект, содержащий начальную и конечную даты предыдущего месяца.
   * */
  getMonthDates() {
    return {
      begDate: moment().utc().subtract(1, "month").startOf("month"), // Получение даты, по умолчанию 01 число предыдущего меся
      endDate: moment().utc().subtract(1, "month").endOf("month"), // Получение даты, по умолчанию последний календарный день предыдущего месяца
    };
  }

  /**
   * Получает дату и возвращает две даты - начало и конец месяца
   * @param {string|Moment} date
   * @returns {{begDate: string, endDate: string}}
   */
  getMonthRange(date = moment.utc()) {
    if (!moment.isMoment(date)) {
      date = moment.utc(new Date(date));
    }

    const begDate = this.getStartOfMonth(date)
    const endDate = this.getEndOfMonth(date);

    return { begDate, endDate };
  }

  /**
   * Возвращает начало месяца, для переданной даты. Если дата не передана, то начало текущего месяца.
   *
   * @param {Moment} date
   * @returns {string}
   */
  getStartOfMonth(date = moment.utc()) {
    return date.startOf("month").format("YYYY-MM-DD");
  }

  /**
   * Возвращает конец месяца, для переданной даты. Если дата не передана, то конец текущего месяца.
   *
   * @param {Moment} date
   * @returns {string}
   */
  getEndOfMonth(date  = moment.utc()) {
    return date.endOf("month").format("YYYY-MM-DD");
  }

  /**
   * Проверяет, что дата содержится в переданном диапазоне дат
   */
  inRange(date, { begDate, endDate }, format = "YYYY-MM-DD") {
    const momentDate = moment(date, format);
    const momentBegDate = moment(begDate, format);
    const momentEndDate = moment(endDate, format);

    return momentDate.isSameOrAfter(momentBegDate) && momentDate.isSameOrBefore(momentEndDate);
  }

  /**
   * @param {string|Moment} date
   * @param {string|Moment} limitDate
   * @param {string} format
   * @returns {boolean}
   */
  isBefore(date, limitDate = moment.utc(), format = "YYYY-MM-DD") {
    if (!date) {
      return false;
    }

    const momentDate = moment(date, format);
    const momentLimitDate = moment(limitDate, format);

    return momentDate.isBefore(momentLimitDate);
  }

  /**
   * @param {string|Moment} date
   * @param {string|Moment} limitDate
   * @param {string} format
   * @returns {boolean}
   */
  isAfter(date, limitDate = moment.utc(), format = "YYYY-MM-DD") {
    if (!date) {
      return false;
    }

    const momentDate = moment(date, format);
    const momentLimitDate = moment(limitDate, format);

    return momentDate.isAfter(momentLimitDate);
  }

  /**
   * @param {string|Moment} date
   * @param {string|Moment} limitDate
   * @param {string} format
   * @returns {boolean}
   */
  isAfterOrEqual(date, limitDate = moment.utc(), format = "YYYY-MM-DD") {
    const momentLimitDate = moment(limitDate, format).subtract(1, 'day');

    return this.isAfter(date, momentLimitDate, format);
  }

  /**
   * @param {string|Moment} date
   * @param {string|Moment} limitDate
   * @param {string} format
   * @returns {boolean}
   */
  isBeforeOrEqual(date, limitDate = moment.utc(), format = "YYYY-MM-DD") {
    const momentLimitDate = moment(limitDate, format).add(1, 'day');

    return this.isBefore(date, momentLimitDate, format);
  }

  getPrevWorkDay(countdownDate = moment.utc()) {
    let day = countdownDate.day();
    let diff = 1;
    if (day === 0 || day === 1) {
      diff = day + 2;
    }

    return countdownDate.subtract(diff, "days").startOf("day");
  }

  getMomentDate(date) {
    if (!moment.isMoment(date)) {
      date = moment.utc(date);
    }

    return date;
  }

  getDaysBetween(startDate, endDate) {
    startDate = this.getMomentDate(startDate);
    endDate = this.getMomentDate(endDate);

    return moment.duration(endDate.diff(startDate)).asDays();
  }

  /**
   *
   * @param offset
   * @param {"add"|"subtract"} direction
   */
  getMonth(offset, direction) {
    return this.getDate()[direction](offset, "month");
  }
}

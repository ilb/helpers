import moment from "moment";
import "moment/locale/ru.js";

/**
 *
 */
moment().locale("ru");
export default class FormatHelper {
  /**
   * @param amount
   * @param options
   * @return {string|string}
   */
  amount(amount, options = {}) {
    const result = new Intl.NumberFormat("ru-RU", options).format(amount);

    return result === "не число" ? "" : result;
  }

  amountFixed(amount) {
    return this.amount(amount, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  date(date, format = "DD.MM.YYYY") {
    // если дата уже в формате DD.MM.YYYY
    if (/\d{2}.\d{2}.\d{4}/.test(date)) {
      return date;
    }

    if (date) {
      return moment(date).format(format);
    }

    return "";
  }

  datetime(date, format = "DD.MM.YYYY HH:mm:ss") {
    // если дата уже в формате DD.MM.YYYY
    if (/\d{2}.\d{2}.\d{4}/.test(date)) {
      return date;
    }

    if (date) {
      return moment(date).format(format);
    }

    return "";
  }

  ISOtoDate(date) {
    if (date) {
      return moment(date, "YYYY-MM-DD").format("DD.MM.YYYY");
    }

    return "";
  }

  phone(phoneNumber) {
    if (!phoneNumber) {
      return "";
    }

    const cleanedNumber = phoneNumber?.replace(/\D/g, "");

    if (cleanedNumber?.length !== 11) {
      return phoneNumber || "";
    }

    return `+${cleanedNumber.slice(0, 1)} (${cleanedNumber.slice(1, 4)}) ${cleanedNumber.slice(
      4,
      7,
    )}-${cleanedNumber.slice(7, 9)}-${cleanedNumber.slice(9)}`;
  }

  /**
   * Возвращает слово в нужном падеже в зависимости от переданного числа.
   * @param {number|string} number - Число, для которого нужно выбрать правильный падеж.
   * @param {string[]} wordForms - Массив форм words для разных падежей.
   *   wordForms[0] - Форма words для числа 1 (например, "яблоко").
   *   wordForms[1] - Форма words для чисел 2-4 (например, "яблока").
   *   wordForms[2] - Форма words для чисел 5 и более (например, "яблок").
   * @return {string} Слово в нужном падеже.
   */
  pluralize(number, wordForms) {
    const cases = [2, 0, 1, 1, 1, 2];
    return wordForms[
      number % 100 > 4 && number % 100 < 20 ? 2 : cases[number % 10 < 5 ? number % 10 : 5]
      ];
  }

  /**
   * Генерирует строку с суммой в рублях и копейках, используя формы слов.
   * @param {number} rubles - Количество рублей.
   * @param {number} penny - Количество копеек.
   * @returns {string} Строка с суммой в формате "{rubles} {форма_рубля} {penny} {форма_копейки}".
   */
  pluralizeAmount(rubles, penny) {
    const rubleForms = ["рубль", "рубля", "рублей"];
    const pennyForms = ["копейка", "копейки", "копеек"];
    return `${rubles} ${this.pluralize(rubles, rubleForms)} ${penny} ${this.pluralize(
      penny,
      pennyForms,
    )}`;
  }


  /**
   *
   * @param {string} seriesAndNumber - Example: 12 34 568920
   * @returns {{number: string, series: string}} Серия и номер паспорта
   */
  getSeriesAndNumber(seriesAndNumber) {
    seriesAndNumber = seriesAndNumber.replaceAll(" ", "");
    const series = seriesAndNumber.slice(0, 4);
    const number = seriesAndNumber.slice(4);
    return { number, series };
  }

}

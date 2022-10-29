const {
  SEX_MALE,
  SEX_FEMALE,
  SEX_NOTSPECIFIC,
  STATUS_SUCCESS,
} = require("../config/constants");

("use strict");

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    return queryInterface.bulkInsert("users", [
      {
        is_admin: true,
        is_verify: true,
        password:
          "$2a$12$im3Jx0DBo6u54e75n5Q.UekUhlRBT/L1nPeBKBB6CBTUVEK5uQT6i",
        first_name: "Jane",
        last_name: "Doe",
        nationality: "Thai",
        pen_name: "jane D",
        email: "jane.d@gmail.com",
        mobile: "0912346666",
        hobby: "",
        id_card_image: "",
        birth_date: "1990-02-22",
        gender: SEX_FEMALE,
        sexually_interested: SEX_MALE,
        book_bank_image: "",
        book_account_number: "",
        bank_name: "",
        description: "",
        wallet: 0,
        average_rating: null,
        is_ban: false,
        provider_request_status: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        is_admin: false,
        is_verify: false,
        password:
          "$2a$12$im3Jx0DBo6u54e75n5Q.UekUhlRBT/L1nPeBKBB6CBTUVEK5uQT6i",
        first_name: "Josh",
        last_name: "Doe",
        nationality: "Thai",
        pen_name: "Josh D",
        email: "josh.d@gmail.com",
        mobile: "0912341111",
        hobby: "",
        id_card_image: "",
        birth_date: "1991-03-22",
        gender: SEX_MALE,
        sexually_interested: SEX_FEMALE,
        book_bank_image: "",
        book_account_number: "",
        bank_name: "",
        description: "",
        wallet: 0,
        average_rating: null,
        is_ban: false,
        provider_request_status: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        is_admin: false,
        is_verify: false,
        password:
          "$2a$12$im3Jx0DBo6u54e75n5Q.UekUhlRBT/L1nPeBKBB6CBTUVEK5uQT6i",
        first_name: "June",
        last_name: "Doe",
        nationality: "Thai",
        pen_name: "Jane D",
        email: "june.d@gmail.com",
        mobile: "0912342222",
        hobby: "",
        id_card_image: "",
        birth_date: "1990-05-24",
        gender: SEX_FEMALE,
        sexually_interested: SEX_MALE,
        book_bank_image: "",
        book_account_number: "",
        bank_name: "",
        description: "",
        wallet: 0,
        average_rating: null,
        is_ban: false,
        provider_request_status: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        is_admin: false,
        is_verify: false,
        password:
          "$2a$12$im3Jx0DBo6u54e75n5Q.UekUhlRBT/L1nPeBKBB6CBTUVEK5uQT6i",
        first_name: "Alex",
        last_name: "Doe",
        nationality: "Thai",
        pen_name: "Alex D",
        email: "june.d@gmail.com",
        mobile: "0912343333",
        hobby: "",
        id_card_image: "",
        birth_date: "1990-08-25",
        gender: SEX_NOTSPECIFIC,
        sexually_interested: SEX_MALE,
        book_bank_image: "",
        book_account_number: "",
        bank_name: "",
        description: "",
        wallet: 0,
        average_rating: null,
        is_ban: false,
        provider_request_status: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        is_admin: false,
        is_verify: false,
        password:
          "$2a$12$im3Jx0DBo6u54e75n5Q.UekUhlRBT/L1nPeBKBB6CBTUVEK5uQT6i",
        first_name: "Eric",
        last_name: "Doe",
        nationality: "Thai",
        pen_name: "Eric D",
        email: "eric.d@gmail.com",
        mobile: "0912344444",
        hobby: "",
        id_card_image: "",
        birth_date: "1990-12-12",
        gender: SEX_MALE,
        sexually_interested: SEX_FEMALE,
        book_bank_image: "",
        book_account_number: "",
        bank_name: "",
        description: "",
        wallet: 0,
        average_rating: null,
        is_ban: false,
        provider_request_status: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        is_admin: false,
        is_verify: true,
        password:
          "$2a$12$im3Jx0DBo6u54e75n5Q.UekUhlRBT/L1nPeBKBB6CBTUVEK5uQT6i",
        first_name: "Brian",
        last_name: "Doe",
        nationality: "Thai",
        pen_name: "Brian D",
        email: "brian.d@gmail.com",
        mobile: "0912345555",
        hobby: "",
        id_card_image: "",
        birth_date: "1992-07-02",
        gender: SEX_MALE,
        sexually_interested: SEX_FEMALE,
        book_bank_image: "",
        book_account_number: "",
        bank_name: "",
        description: "",
        wallet: 0,
        average_rating: null,
        is_ban: false,
        provider_request_status: STATUS_SUCCESS,
        created_at: new Date(),
        updated_at: new Date(),
        language: "Thai",
        rate: 2000,
        lat: "13.7781783",
        lng: "100.5735217",
      },
      {
        is_admin: false,
        is_verify: true,
        password:
          "$2a$12$im3Jx0DBo6u54e75n5Q.UekUhlRBT/L1nPeBKBB6CBTUVEK5uQT6i",
        first_name: "Jenny",
        last_name: "Doe",
        nationality: "Thai",
        pen_name: "Jenny D",
        email: "jenny.d@gmail.com",
        mobile: "0911111111",
        hobby: "",
        id_card_image: "",
        birth_date: "1997-02-11",
        gender: SEX_FEMALE,
        sexually_interested: SEX_MALE,
        book_bank_image: "",
        book_account_number: "",
        bank_name: "",
        description: "",
        wallet: 0,
        average_rating: null,
        is_ban: false,
        provider_request_status: STATUS_SUCCESS,
        created_at: new Date(),
        updated_at: new Date(),
        language: "English",
        rate: 800,
        lat: "13.7462411",
        lng: "100.5347402",
      },
      {
        is_admin: false,
        is_verify: true,
        password:
          "$2a$12$im3Jx0DBo6u54e75n5Q.UekUhlRBT/L1nPeBKBB6CBTUVEK5uQT6i",
        first_name: "Jenifer",
        last_name: "Doe",
        nationality: "Thai",
        pen_name: "Jenifer D",
        email: "jenifer.d@gmail.com",
        mobile: "0922222222",
        hobby: "",
        id_card_image: "",
        birth_date: "1992-07-02",
        gender: SEX_FEMALE,
        sexually_interested: SEX_MALE,
        book_bank_image: "",
        book_account_number: "",
        bank_name: "",
        description: "",
        wallet: 0,
        average_rating: null,
        is_ban: false,
        provider_request_status: STATUS_SUCCESS,
        created_at: new Date(),
        updated_at: new Date(),
        language: "Thai",
        rate: 500,
        lat: "13.7462411",
        lng: "100.5347402",
      },
      {
        is_admin: false,
        is_verify: true,
        password:
          "$2a$12$im3Jx0DBo6u54e75n5Q.UekUhlRBT/L1nPeBKBB6CBTUVEK5uQT6i",
        first_name: "Anna",
        last_name: "Doe",
        nationality: "Thai",
        pen_name: "Anna D",
        email: "anna.d@gmail.com",
        mobile: "0933333333",
        hobby: "",
        id_card_image: "",
        birth_date: "1992-07-02",
        gender: SEX_FEMALE,
        sexually_interested: SEX_MALE,
        book_bank_image: "",
        book_account_number: "",
        bank_name: "",
        description: "",
        wallet: 0,
        average_rating: null,
        is_ban: true,
        provider_request_status: STATUS_SUCCESS,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete("Users", null, {});
  },
};

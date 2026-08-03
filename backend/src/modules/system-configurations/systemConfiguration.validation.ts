import { body, param, query } from "express-validator";



export const updateSystemConfigurationValidator = [
    param("configKey")
        .trim()
        .notEmpty()
        .withMessage("Config key is required."),

    body("configKey")
        .not()
        .exists()
        .withMessage("Config key cannot be updated."),

    body("configValue")
        .notEmpty()
        .withMessage("Config value is required."),

    body("description")
        .optional({ nullable: true })
        .trim(),

];

export const getSystemConfigurationByKeyValidator = [
    param("configKey")
        .trim()
        .notEmpty()
        .withMessage("Config key is required."),
];

export const getSystemConfigurationsValidator = [
    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be greater than 0."),

    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("Limit must be between 1 and 100."),

    query("search")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage("Search term is too long."),
];

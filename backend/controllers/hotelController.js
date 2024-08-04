const Hotel = require('../models/Hotel');

/**
 * @swagger
 * components:
 *   schemas:
 *     Hotel:
 *       type: object
 *       required:
 *         - name
 *         - location
 *         - pricePerNight
 *         - availableRooms
 *         - description
 *       properties:
 *         hotelId:
 *           type: string
 *           description: The ID of the hotel
 *         name:
 *           type: string
 *           description: The name of the hotel
 *         location:
 *           type: string
 *           description: The location of the hotel
 *         pricePerNight:
 *           type: number
 *           description: The price per night for the hotel
 *         availableRooms:
 *           type: number
 *           description: The number of available rooms
 *         description:
 *           type: string
 *           description: A brief description of the hotel
 *         createdAt:
 *           type: string
 *           description: The date and time when the hotel was created
 *       example:
 *         hotelId: exampleHotelId
 *         name: Example Hotel
 *         location: New York
 *         pricePerNight: 150
 *         availableRooms: 5
 *         description: A beautiful hotel in New York
 *         createdAt: 2024-01-01T00:00:00.000Z
 */

/**
 * @swagger
 * tags:
 *   name: Hotels
 *   description: The hotel managing API
 */

/**
 * @swagger
 * /hotels:
 *   get:
 *     summary: Get all hotels
 *     tags: [Hotels]
 *     responses:
 *       200:
 *         description: A list of hotels
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Hotel'
 *       400:
 *         description: Some error happened
 */
exports.getAllHotels = async (req, res) => {
  try {
    const hotels = await Hotel.getAll();
    res.send(hotels);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

/**
 * @swagger
 * /hotels/{id}:
 *   get:
 *     summary: Get a hotel by ID
 *     tags: [Hotels]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the hotel
 *     responses:
 *       200:
 *         description: The hotel description by ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hotel'
 *       404:
 *         description: The hotel was not found
 *       400:
 *         description: Some error happened
 */
exports.getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.getById(req.params.id);
    if (!hotel) {
      return res.status(404).send('Hotel not found');
    }
    res.send(hotel);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

/**
 * @swagger
 * /hotels/search:
 *   get:
 *     summary: Search hotels
 *     tags: [Hotels]
 *     parameters:
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: The location of the hotel
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: The minimum price per night
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: The maximum price per night
 *     responses:
 *       200:
 *         description: A list of hotels matching the search criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Hotel'
 *       400:
 *         description: Some error happened
 */
exports.searchHotels = async (req, res) => {
  try {
    const { location, minPrice, maxPrice } = req.query;
    const hotels = await Hotel.search({ location, minPrice, maxPrice });
    res.send(hotels);
  } catch (err) {
    res.status(400).send(err.message);
  }
};
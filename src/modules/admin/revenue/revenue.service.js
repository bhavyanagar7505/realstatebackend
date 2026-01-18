const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/* ================= SELL UNIT (BOOKING + PAYMENT) ================= */
exports.sellUnit = async (data) => {
  return prisma.$transaction(async (tx) => {
    const {
      projectId,
      unitId,
      salePrice,
      bookingAmount,
      paymentMode,
      paymentReference,
      customer
    } = data;

    /* ================= VALIDATION ================= */

    // bookingAmount checks
    if (bookingAmount === undefined || bookingAmount === null) {
      throw new Error("bookingAmount missing from request body");
    }

    const parsedBookingAmount = Number(bookingAmount);
    const parsedSalePrice = Number(salePrice);

    if (Number.isNaN(parsedBookingAmount)) {
      throw new Error("bookingAmount must be a number");
    }

    if (parsedBookingAmount <= 0) {
      throw new Error("bookingAmount must be greater than 0");
    }

    if (Number.isNaN(parsedSalePrice) || parsedSalePrice <= 0) {
      throw new Error("Invalid sale price");
    }

    if (parsedBookingAmount > parsedSalePrice) {
      throw new Error("Booking amount cannot exceed sale price");
    }

    // basic customer validation
    if (!customer?.name || !customer?.phone) {
      throw new Error("Customer name and phone are required");
    }

    /* ================= BUSINESS LOGIC ================= */

    /* 1️⃣ CHECK IF UNIT IS ALREADY SOLD */
    const existingUnit = await tx.unit.findUnique({
      where: { id: unitId }
    });

    if (!existingUnit) {
      throw new Error("Unit not found");
    }

    if (existingUnit.status === "SOLD") {
      throw new Error("Unit is already sold");
    }

    /* 2️⃣ CREATE CUSTOMER */
    const createdCustomer = await tx.customer.create({
      data: {
        name: customer.name,
        phone: customer.phone,
        email: customer.email || null,
        address: customer.address || null
      }
    });

    /* 3️⃣ CREATE SALE */
    const sale = await tx.unitSale.create({
      data: {
        projectId,
        unitId,
        customerId: createdCustomer.id,
        salePrice: parsedSalePrice,
        bookingDate: new Date(),
        status: "BOOKED"
      }
    });

    /* 4️⃣ CREATE BOOKING PAYMENT */
    await tx.payment.create({
      data: {
        saleId: sale.id,
        amount: parsedBookingAmount,
        paymentDate: new Date(),
        mode: paymentMode || "BANK_TRANSFER",
        reference: paymentReference || null
      }
    });

    /* 5️⃣ UPDATE UNIT STATUS */
    await tx.unit.update({
      where: { id: unitId },
      data: { status: "SOLD" }
    });

    return sale;
  });
};

/* ================= PROJECT REVENUE ================= */
exports.getProjectRevenue = async (projectId) => {
  const payments = await prisma.payment.findMany({
    where: {
      sale: { projectId }
    }
  });

  return payments.reduce((sum, p) => sum + Number(p.amount), 0);
};

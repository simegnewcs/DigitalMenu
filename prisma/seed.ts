import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../lib/auth';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminPassword = await hashPassword('admin123');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('Created admin user:', admin.email);

  // Create owner user
  const ownerPassword = await hashPassword('owner123');
  const owner = await prisma.user.upsert({
    where: { email: 'owner@example.com' },
    update: {},
    create: {
      name: 'Restaurant Owner',
      email: 'owner@example.com',
      password: ownerPassword,
      role: 'OWNER',
    },
  });
  console.log('Created owner user:', owner.email);

  // Create sample restaurant for owner
  const restaurant = await prisma.restaurant.upsert({
    where: { slug: 'sample-restaurant' },
    update: {},
    create: {
      name: 'Sample Restaurant',
      slug: 'sample-restaurant',
      description: 'A sample restaurant to get you started',
      address: '123 Main Street, City',
      phone: '+1 234 567 8900',
      ownerId: owner.id,
      isActive: true,
    },
  });
  console.log('Created restaurant:', restaurant.name);

  // Create sample categories
  const categories = [
    { name: 'Appetizers', description: 'Start your meal right', sortOrder: 1 },
    { name: 'Main Courses', description: 'Hearty meals', sortOrder: 2 },
    { name: 'Desserts', description: 'Sweet endings', sortOrder: 3 },
    { name: 'Beverages', description: 'Refreshing drinks', sortOrder: 4 },
  ];

  for (const cat of categories) {
    const category = await prisma.category.upsert({
      where: { id: `${restaurant.id}-${cat.name}` },
      update: {},
      create: {
        name: cat.name,
        description: cat.description,
        sortOrder: cat.sortOrder,
        restaurantId: restaurant.id,
      },
    });
    console.log('Created category:', category.name);

    // Add sample menu items to each category
    if (cat.name === 'Appetizers') {
      await prisma.menuItem.createMany({
        data: [
          {
            name: 'Bruschetta',
            description: 'Grilled bread with tomatoes, garlic, and basil',
            price: 8.99,
            isAvailable: true,
            isPopular: true,
            categoryId: category.id,
            sortOrder: 1,
          },
          {
            name: 'Caesar Salad',
            description: 'Romaine lettuce with Caesar dressing and croutons',
            price: 10.99,
            isAvailable: true,
            categoryId: category.id,
            sortOrder: 2,
          },
        ],
      });
    }

    if (cat.name === 'Main Courses') {
      await prisma.menuItem.createMany({
        data: [
          {
            name: 'Grilled Salmon',
            description: 'Fresh salmon with lemon butter sauce',
            price: 24.99,
            isAvailable: true,
            isPopular: true,
            categoryId: category.id,
            sortOrder: 1,
          },
          {
            name: 'Ribeye Steak',
            description: '12oz ribeye with mashed potatoes',
            price: 32.99,
            isAvailable: true,
            categoryId: category.id,
            sortOrder: 2,
          },
          {
            name: 'Pasta Primavera',
            description: 'Fresh vegetables with pasta in light sauce',
            price: 18.99,
            isAvailable: true,
            categoryId: category.id,
            sortOrder: 3,
          },
        ],
      });
    }

    if (cat.name === 'Desserts') {
      await prisma.menuItem.createMany({
        data: [
          {
            name: 'Tiramisu',
            description: 'Classic Italian coffee-flavored dessert',
            price: 9.99,
            isAvailable: true,
            isPopular: true,
            categoryId: category.id,
            sortOrder: 1,
          },
          {
            name: 'Chocolate Lava Cake',
            description: 'Warm chocolate cake with vanilla ice cream',
            price: 11.99,
            isAvailable: true,
            categoryId: category.id,
            sortOrder: 2,
          },
        ],
      });
    }

    if (cat.name === 'Beverages') {
      await prisma.menuItem.createMany({
        data: [
          {
            name: 'Fresh Lemonade',
            description: 'Homemade lemonade with mint',
            price: 4.99,
            isAvailable: true,
            categoryId: category.id,
            sortOrder: 1,
          },
          {
            name: 'Iced Coffee',
            description: 'Cold brew coffee with cream',
            price: 5.99,
            isAvailable: true,
            categoryId: category.id,
            sortOrder: 2,
          },
        ],
      });
    }
  }

  console.log('\n✅ Seeding completed!');
  console.log('\nDemo credentials:');
  console.log('Admin: admin@example.com / admin123');
  console.log('Owner: owner@example.com / owner123');
  console.log('\nPublic menu URL: http://localhost:3000/menu/sample-restaurant');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

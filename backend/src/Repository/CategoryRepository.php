<?php

namespace App\Repository;

use App\Entity\Category;
use App\Entity\Restaurant;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Category>
 *
 * @method Category|null find($id, $lockMode = null, $lockVersion = null)
 * @method Category|null findOneBy(array $criteria, array $orderBy = null)
 * @method Category[]    findAll()
 * @method Category[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CategoryRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Category::class);
    }

    public function save(Category $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Category $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * @return array
     */
    public function getAllCategories(): array
    {
        return $this->createQueryBuilder('c')
            ->select('c.id, c.category_name')
            ->andWhere('c.active = 1')
            ->getQuery()
            ->getResult();
    }

    /**
     * @param $id
     * @return array
     */
    public function getOneCategoryById($id): array
    {
        return $this->createQueryBuilder('c')
            ->select('c.id, c.category_name')
            ->where('c.id = :id')
            ->andWhere('c.active = 1')
            ->setParameter('id', $id)
            ->getQuery()
            ->getResult();
    }

    /**
     * @param $categoryName
     * @return void
     */
    public function addCategory($categoryName): void
    {
        $category = new Category();
        $category->setCategoryName($categoryName);
        $category->setActive(true);
        $this->save($category, true);
    }

    /**
     * @param $id
     * @param $categoryName
     * @return void
     */
    public function updateCategory($id, $categoryName): void
    {
        $category = $this->find($id);
        $category->setCategoryName($categoryName);
        $this->save($category, true);
    }

    /**
     * @param $id
     * @return void
     */
    public function deleteCategory($id): void
    {
        $category = $this->find($id);
        $category->setActive(false);
        $this->save($category, true);
    }

    public function getRestaurantByCategory($id)
    {
        return $this->createQueryBuilder('c')
            ->select('r.id restaurant_id, r.imageurl restaurant_image, r.name restaurant_name')
            ->innerJoin(Restaurant::class, 'r', 'WITH', 'r.category = c.id')
            ->where('c.id = :id')
            ->andWhere('c.active = 1')
            ->andWhere('r.active = 1')
            ->setParameter('id', $id)
            ->getQuery()
            ->getResult();
    }

//    /**
//     * @return Category[] Returns an array of Category objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('c')
//            ->andWhere('c.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('c.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Category
//    {
//        return $this->createQueryBuilder('c')
//            ->andWhere('c.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}

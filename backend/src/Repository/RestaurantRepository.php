<?php

namespace App\Repository;

use App\Entity\Category;
use App\Entity\Comment;
use App\Entity\Menu;
use App\Entity\Restaurant;
use App\Entity\UserAuth;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Restaurant>
 *
 * @method Restaurant|null find($id, $lockMode = null, $lockVersion = null)
 * @method Restaurant|null findOneBy(array $criteria, array $orderBy = null)
 * @method Restaurant[]    findAll()
 * @method Restaurant[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class RestaurantRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Restaurant::class);
    }

    public function save(Restaurant $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Restaurant $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function findAllRestaurants()
    {
        return $this->createQueryBuilder('r')
            ->select('r.id, r.name, r.introduction, r.address, r.imageurl, r.openclose, c.category_name category')
            ->innerJoin(Category::class, 'c', 'WITH', 'c.id = r.category')
            ->andWhere('r.active = 1')
            ->andWhere('c.active = 1')
            ->getQuery()
            ->getResult();
    }

    public function findOneById($id)
    {
        return $this->createQueryBuilder('r')
            ->select('u.email, u.imageurl user_image, r.id, r.name, r.introduction, r.address, r.imageurl, r.openclose, c.category_name category')
            ->innerJoin(Category::class, 'c', 'WITH', 'c.id = r.category')
            ->innerJoin(UserAuth::class, 'u', 'WITH', 'u.id = r.userauthtable')
            ->andWhere('r.active = 1')
            ->andWhere('c.active = 1')
            ->andWhere('r.id = :id')
            ->setParameter('id', $id)
            ->getQuery()
            ->getResult();
    }

    public function findOneByToken($id)
    {
        return $this->createQueryBuilder('r')
            ->select('r.id, r.name, r.introduction, r.address, r.imageurl, r.openclose, c.category_name category')
            ->innerJoin(Category::class, 'c', 'WITH', 'c.id = r.category')
            ->innerJoin(UserAuth::class, 'u', 'WITH', 'u.id = r.userauthtable')
            ->andWhere('r.active = 1')
            ->andWhere('c.active = 1')
            ->andWhere('r.userauthtable = :id')
            ->setParameter('id', $id)
            ->getQuery()
            ->getResult();
    }

//    /**
//     * @return Restaurant[] Returns an array of Restaurant objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('r')
//            ->andWhere('r.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('r.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Restaurant
//    {
//        return $this->createQueryBuilder('r')
//            ->andWhere('r.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}

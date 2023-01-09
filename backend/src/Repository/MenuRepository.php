<?php

namespace App\Repository;

use App\Entity\Menu;
use App\Entity\Restaurant;
use App\Entity\UserAuth;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Menu>
 *
 * @method Menu|null find($id, $lockMode = null, $lockVersion = null)
 * @method Menu|null findOneBy(array $criteria, array $orderBy = null)
 * @method Menu[]    findAll()
 * @method Menu[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class MenuRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Menu::class);
    }

    public function save(Menu $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function findNewest()
    {
        return $this->createQueryBuilder('m')
            ->select('m.imageurl dish_image, m.name dish_name, r.name restaurant_name, r.id restaurant_id, u.imageurl user_image, u.email user_email')
            ->innerJoin(Restaurant::class, 'r', 'WITH', 'm.restauranttable = r.id')
            ->innerJoin(UserAuth::class, 'u', 'WITH', 'r.userauthtable = u.id')
            ->andWhere('r.active = 1')
            ->andWhere('m.active = 1')
            ->andWhere('u.active = 1')
            ->orderBy('m.id', 'DESC')
            ->setMaxResults(5)
            ->getQuery()
            ->getResult();
    }

    public function remove(Menu $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * @param $id
     * @return array
     */
    public function findByRestaurantId($id): array
    {
        return $this->createQueryBuilder('m')
            ->select('m.id, m.name, m.price, m.about, m.imageurl')
            ->innerJoin(Restaurant::class, 'r', 'WITH', 'r.id = m.restauranttable')
            ->andWhere('m.restauranttable = :id')
            ->andWhere('m.active = 1')
            ->andWhere('r.active = 1')
            ->setParameter('id', $id)
            ->getQuery()
            ->getResult();
    }

    public function getAllMenusByRestaurant($id)
    {
        return $this->createQueryBuilder('m')
            ->select('m.id, m.name, m.price, m.about, m.imageurl')
            ->andWhere('m.restauranttable = :id')
            ->andWhere('m.active = 1')
            ->setParameter('id', $id)
            ->getQuery()
            ->getResult();
    }

//    /**
//     * @return Menu[] Returns an array of Menu objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('m')
//            ->andWhere('m.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('m.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Menu
//    {
//        return $this->createQueryBuilder('m')
//            ->andWhere('m.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}

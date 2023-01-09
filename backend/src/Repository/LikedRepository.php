<?php

namespace App\Repository;

use App\Entity\Category;
use App\Entity\City;
use App\Entity\Liked;
use App\Entity\Restaurant;
use App\Entity\UserAuth;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Liked>
 *
 * @method Liked|null find($id, $lockMode = null, $lockVersion = null)
 * @method Liked|null findOneBy(array $criteria, array $orderBy = null)
 * @method Liked[]    findAll()
 * @method Liked[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class LikedRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Liked::class);
    }

    public function save(Liked $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Liked $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * @return array
     */
    public function findMostLikedRestaurants(): array
    {
        return $this->createQueryBuilder('l')
            ->select('count(l.id) as likes, c.city_name, r.imageurl restaurant_image, r.id restaurant_id, r.name, r.address, u.email, u.imageurl, u.id user_id')
            ->innerJoin(Restaurant::class, 'r', 'WITH', 'r.id = l.restauranttable')
            ->innerJoin(City::class, 'c', 'WITH', 'c.id = r.city')
            ->innerJoin(UserAuth::class, 'u', 'WITH', 'u.id = r.userauthtable')
            ->innerJoin(Category::class, 'ca', 'WITH', 'ca.id = r.category')
            ->andWhere('ca.active = 1')
            ->andWhere('r.active = 1')
            ->andWhere('l.active = 1')
            ->andWhere('c.active = 1')
            ->andWhere('u.active = 1')
            ->groupBy('l.restauranttable')
            ->orderBy('likes', 'DESC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult();
    }

    /**
     * @param $restaurantEntity
     * @param $userauthEntity
     * @return void
     */
    public function addLiked($restaurantEntity, $userauthEntity): void
    {
        $liked = new Liked();
        $liked->setRestauranttable($restaurantEntity);
        $liked->setUserauthtable($userauthEntity);
        $liked->setActive(1);
        $this->save($liked, true);
    }

    public function deleteLiked($id, $userEntity): void
    {
        $liked = $this->find($id);
        $liked->setActive(0);
        $liked->setUserauthtable($userEntity);
        $this->save($liked, true);
    }

    public function getLikedRestaurantByUser($userId, $restaurantId)
    {
        return $this->createQueryBuilder('l')
            ->andWhere('l.restauranttable = :restaurant')
            ->andWhere('l.userauthtable = :user')
            ->setParameter('restaurant', $restaurantId)
            ->setParameter('user', $userId)
            ->getQuery()
            ->getResult();
    }

    public function getAllLikesByRestaurant($restaurantId)
    {
        return $this->createQueryBuilder('l')
            ->select('count(l.id) as likes')
            ->andWhere('l.restauranttable = :restaurant')
            ->setParameter('restaurant', $restaurantId)
            ->getQuery()
            ->getResult();
    }

    public function changeStatus($likedEntity)
    {
        $likedEntity->setActive(true);
        $this->save($likedEntity, true);
    }
//    /**
//     * @return Liked[] Returns an array of Liked objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('l')
//            ->andWhere('l.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('l.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Liked
//    {
//        return $this->createQueryBuilder('l')
//            ->andWhere('l.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}

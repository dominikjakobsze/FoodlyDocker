<?php

namespace App\Repository;

use App\Entity\City;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<City>
 *
 * @method City|null find($id, $lockMode = null, $lockVersion = null)
 * @method City|null findOneBy(array $criteria, array $orderBy = null)
 * @method City[]    findAll()
 * @method City[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CityRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, City::class);
    }

    public function save(City $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(City $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function getAllCities(): array
    {
        return $this->getEntityManager()->createQueryBuilder()
            ->select('c.city_name, c.id, c.imageurl')
            ->from(City::class, 'c')
            ->andWhere('c.active = 1')
            ->getQuery()
            ->getResult(); // returns an array of arrays
        /*
            return $this->getEntityManager()->createQueryBuilder()
                ->select('c')
                ->from(City::class, 'c')
                ->andWhere('c.active = 1')
                ->getQuery()
                ->getResult(); //returns an array of Entities
        */
    }

    public function getOneCityById($id): array
    {
        return $this->createQueryBuilder('c')
            ->select('c.city_name, c.id')
            ->andWhere('c.id = :id')
            ->andWhere('c.active = 1')
            ->setParameter('id', $id)
            ->getQuery()
            ->getResult();
    }

    public function addCity(string $city_name, string $newFileName): void
    {
        $city = new City();
        $city->setCityName($city_name);
        $city->setActive(true);
        $city->setImageurl("/image/cities/" . $newFileName);
        $this->save($city, true);
    }

    public function updateCity(int $id, string $city_name, string $newFileName): void
    {
        $city = $this->find($id);
        $city->setCityName($city_name);
        $city->setImageurl("/image/cities/" . $newFileName);
        $this->save($city, true);
    }

    public function deleteCity(int $id): void
    {
        $city = $this->find($id);
        $city->setActive(false);
        $this->save($city, true);
    }

//    /**
//     * @return City[] Returns an array of City objects
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

//    public function findOneBySomeField($value): ?City
//    {
//        return $this->createQueryBuilder('c')
//            ->andWhere('c.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}

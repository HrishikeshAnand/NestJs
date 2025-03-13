import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepository: Repository<User>;

  beforeEach(() => {
    userRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    usersService = new UsersService(userRepository);
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const mockUsers = [
        {
          id: 1,
          name: 'Hrishikesh',
          email: 'hrishikesh@translense.com',
          role: 'ADMIN',
        },
        {
          id: 2,
          name: 'Abhishek',
          email: 'abhishek@email.in',
          role: 'ENGINEER',
        },
      ];
      jest.spyOn(userRepository, 'find').mockResolvedValue(mockUsers);

      expect(await usersService.findAll()).toBe(mockUsers);
    });

    it('should return users by role', async () => {
      const mockUsers = [
        { id: 1, name: 'John', email: 'john@email.in', role: 'ENGINEER' },
      ];
      jest.spyOn(userRepository, 'find').mockResolvedValue(mockUsers);

      expect(await usersService.findAll('ENGINEER')).toBe(mockUsers);
    });

    it('should throw NotFoundException if role is not found', async () => {
      jest.spyOn(userRepository, 'find').mockResolvedValue([]);
      await expect(usersService.findAll('ADMIN')).rejects.toThrow(NotFoundException);
      await expect(usersService.findAll('ADMIN')).rejects.toThrow('The asked role is not found');
    });
  });

  describe('find', () => {
    it('should return the required user', async () => {
      const mockUser = { id: 1, name: 'John', email: 'john@email.in', role: 'ENGINEER' };
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      expect(await usersService.find(1)).toBe(mockUser);
    })

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      await expect(usersService.find(999)).rejects.toThrow(NotFoundException);
      await expect(usersService.find(999)).rejects.toThrow('User with id:999 not found');
    });
  })

  describe('create', () => {
    it('should create and return a new user', async () => {

      const mockUserDto: CreateUserDto = {
        name: "Hrishikesh",
        email: "hrishikesh@translense.com",
        role: "ADMIN"
      }

      const mockCreatedUser = {
        id: 1,
        ...mockUserDto
      };

      jest.spyOn(userRepository, 'create').mockReturnValue(mockCreatedUser);
      jest.spyOn(userRepository, 'save').mockResolvedValue(mockCreatedUser);

      await expect(usersService.create(mockUserDto)).resolves.toEqual(mockCreatedUser);

      expect(userRepository.create).toHaveBeenCalledWith(mockUserDto);
      expect(userRepository.save).toHaveBeenCalledWith(mockCreatedUser);
    })
  })

  describe('update', () => {
    it('should update the user and return the updated user', async () => {

      const mockUpdatedUserDto: UpdateUserDto = {
        name: "Hrishikesh",
        email: "hrishikesh@translense.com",
        role: "ENGINEER"
      }

      const mockUpdatedUser = {
        id: 1,
        name: "Hrishikesh",
        email: "hrishikesh@translense.com",
        role: "ENGINEER"
      }

      jest.spyOn(userRepository, 'update').mockResolvedValue({affected: 1} as any);
      jest.spyOn(usersService, 'find').mockResolvedValue(mockUpdatedUser);

      await expect (usersService.update(1, mockUpdatedUserDto)).resolves.toEqual(mockUpdatedUser);

      expect(userRepository.update).toHaveBeenCalledWith(1, mockUpdatedUserDto);
      expect(usersService.find).toHaveBeenCalledWith(1);

    })

    it('should throw NotFoundException if user does not exist', async () => {
      const mockUpdatedUserDto: UpdateUserDto = {
        name: "Hrishikesh",
        email: "hrishikesh@translense.com",
        role: "ENGINEER"
      };
    
      jest.spyOn(userRepository, 'update').mockResolvedValue({ affected: 0 } as any);
    
      await expect(usersService.update(99, mockUpdatedUserDto)).rejects.toThrow(NotFoundException);
      await expect(usersService.update(99, mockUpdatedUserDto)).rejects.toThrow('User with id:99 not found');
    });
    
  })

  describe('delete', () => {

    it('should delete the user and return the deleted user', async () => {
      const mockId = 1;
      const mockUser = {id: 1, name: 'Hrishikesh', email: 'hrishikesh@translense.com', role: 'ADMIN'};

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(userRepository, 'delete').mockResolvedValue({affected: 1} as any);

      await expect(usersService.delete(mockId)).resolves.toEqual(mockUser);

      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: mockId } });
      expect(userRepository.delete).toHaveBeenCalledWith(mockId);
    })

    it('should return null if user does not exist', async () => {
      const mockId = 99;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(userRepository, 'delete');

      await expect(usersService.delete(mockId)).resolves.toBe(null);

      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: mockId } });
      expect(userRepository.delete).not.toHaveBeenCalled();
    })
  })
});

import { NotFoundException } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";



describe('UsersController', () => {
    
    let usersController: UsersController;
    let usersService: UsersService;

    beforeEach(()=> {
        usersService = {
            findAll: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        } as any;

        usersController = new UsersController(usersService);
    })

    
    describe('findAll', () => {

        it('should return all users', async () => {
            const mockUsers = [{id: 1, name: 'Hrishikesh', email: 'hrishikeshanand3@gmail.com', role: 'ADMIN'}, {id: 2, name: 'Abhishke Anand', email: 'abhishke@email.in', role: 'ENGINEER'}];
            jest.spyOn(usersService, 'findAll').mockResolvedValue(mockUsers);
            expect (await usersController.findAll()).toBe(mockUsers);
        })

        it('shoould return users filtered by role', async () => {
            const mockUsers = [{id: 1, name: 'Hrishikesh Anand', email: 'hrishikeshanand3@gmail.com', role: 'ADMIN'}];
            jest.spyOn(usersService, 'findAll').mockResolvedValue(mockUsers)
            expect (await usersController.findAll('ADMIN')).toBe(mockUsers);
        })

        it('should should throw NotFoundException if role not found', async () => {
            jest.spyOn(usersService, 'findAll').mockRejectedValue(new NotFoundException('The asked role is not found'));
            await expect(usersController.findAll('ADMIN')).rejects.toThrow(NotFoundException);
        })
    })

    describe('findOne', () => {

        it('should return the requested user', async () => {
            const mockId = 1;
            const mockUser = {id: mockId, name: 'Hrishikesh', email: 'hrishikeshanand3@gmail.com', role: 'ADMIN'};
            jest.spyOn(usersService, 'find').mockResolvedValue(mockUser);
            expect(await usersController.findOne(mockId)).toBe(mockUser);
        })

        it('should throw NotFoundException if no user found', async () => {
            const mockId = 1;
            jest.spyOn(usersService, 'find').mockRejectedValue(new NotFoundException(`User with id:${mockId} not found`));
            await expect(usersController.findOne(mockId)).rejects.toThrow(NotFoundException);
        })

    })

    describe('create', () => {
        
        it('should create and return the new user', async () => {
            const mockUserDto: CreateUserDto = {
                name: 'Hrishikesh Anand',
                email: 'hrishikesh.anand@translense.com',
                role: 'ADMIN'
            }
            const mockCreatedUser = {id: 1, ...mockUserDto};
            jest.spyOn(usersService, 'create').mockResolvedValue(mockCreatedUser);
            expect(await usersController.create(mockUserDto)).toBe(mockCreatedUser);
        })

    })

    describe('update', () => {
        
        it('should update and return the updated user', async () => {
            const mockId = 1;
            const mockUpdatedUserDto: UpdateUserDto = {
                name: 'Hrishikesh',
                email: 'hrishikesh@translense.com',
                role: 'ENGINEER'
            }
            const mockUpdatedUser = {id: mockId, ...mockUpdatedUserDto};
            jest.spyOn(usersService, 'update').mockResolvedValue(mockUpdatedUser as any);
            expect (await usersController.update(mockId, mockUpdatedUserDto)).toBe(mockUpdatedUser);
        })

        it('should thow notFoundExpection if user not found', async () => {
            const mockId = 1;
            jest.spyOn(usersService, 'update').mockRejectedValue(new NotFoundException(`user with id:${mockId} not found`));
            await expect(usersController.update(mockId, {name: 'Hrishikesh Anand'})).rejects.toThrow(NotFoundException);
        })

    })

    describe('delete', () => {
        
        it('should delete and return the deleted user', async () => {
            const mockId = 1;
            const mockUser = {id: mockId, name: 'Hrishikesh Anand', email: 'hrishikesh@translense.com', role: 'ADMIN'};
            jest.spyOn(usersService, 'delete').mockResolvedValue(mockUser);
            expect(await usersController.delete(mockId)).toBe(mockUser);
        })

        it('should throw null if user does not exist', async () => {
            jest.spyOn(usersService, 'delete').mockResolvedValue(null);
            expect(await usersController.delete(99)).toBe(null);
        })
    })
})
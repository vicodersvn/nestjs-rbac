import { DynamicModule, Global, Module } from '@nestjs/common';
import { RbacService } from './services/rbac.service';
import { ModuleRef, Reflector } from '@nestjs/core';
import { StorageRbacService } from './services/storage.rbac.service';
import { IStorageRbac } from './interfaces/storage.rbac.interface';
import { IDynamicStorageRbac } from './interfaces/dynamic.storage.rbac.interface';
import { ICacheRBAC } from './interfaces/cache.rbac.interface';

@Global()
@Module({
  providers: [RbacService, StorageRbacService, Reflector],
  imports: [],
  exports: [RbacService],
})
export class RbacModule {
  private static cache?: any | ICacheRBAC;
  private static cacheOptions?: { key?: string; ttl?: number };

  static useCache(
    cache: any | ICacheRBAC,
    options?: {
      key?: string;
      ttl?: number;
    },
  ) {
    RbacModule.cache = cache;
    RbacModule.cacheOptions = options;
    return RbacModule;
  }

  static forRoot(
    rbac: IStorageRbac,
    providers?: any[],
    imports?: any[],
  ): DynamicModule {
    return RbacModule.forDynamic(
      /* tslint:disable */
      class {
        async getRbac(): Promise<IStorageRbac> {
          return rbac;
        }
      },
      providers,
      imports,
    );
  }

  static forDynamic(
    rbac: new () => IDynamicStorageRbac,
    providers?: any[],
    imports?: any[],
  ): DynamicModule {
    const inject = [ModuleRef, rbac];
    const commonProviders = [];
    if (RbacModule.cache) {
      commonProviders.push(RbacModule.cache, {
        provide: 'ICacheRBAC',
        useFactory: (cache: ICacheRBAC): ICacheRBAC => {
          return RbacModule.setCacheOptions(cache);
        },
        inject: [RbacModule.cache],
      });
      inject.push(RbacModule.cache);
    }

    commonProviders.push(
      ...[
        ...(providers || []),
        rbac,
        {
          provide: StorageRbacService,
          useFactory: async (
            moduleRef: ModuleRef,
            rbacService: IDynamicStorageRbac,
            cache?: ICacheRBAC,
          ) => {
            return new StorageRbacService(
              moduleRef,
              rbacService,
              RbacModule.setCacheOptions(cache),
            );
          },
          inject,
        },
      ],
    );

    return {
      module: RbacModule,
      providers: commonProviders,
      imports: [...(imports || [])],
    };
  }

  private static setCacheOptions(cache?: ICacheRBAC) {
    if (!cache || RbacModule.cacheOptions) {
      return cache;
    }
    if (!RbacModule.cacheOptions) {
      return cache;
    }
    if (RbacModule.cacheOptions.key) {
      cache.key = RbacModule.cacheOptions.key;
    }

    if (RbacModule.cacheOptions.ttl) {
      cache.ttl = RbacModule.cacheOptions.ttl;
    }

    return cache;
  }
}

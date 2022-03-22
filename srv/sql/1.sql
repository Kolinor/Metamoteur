create table SITES
(
    SITE_ID        BIGINT,
    DOMAIN         VARCHAR(100)                        not null,
    IPV4           BOOLEAN                             null,
    IPV6           BOOLEAN                             null,
    DATE_CREATION TIMESTAMP default CURRENT_TIMESTAMP not null,
    UPDATE_IPV6    TIMESTAMP                           null
);

create index SITES_DOMAIN_index
    on SITES (DOMAIN);

create unique index SITES_SITE_ID_uindex
    on SITES (SITE_ID);

alter table SITES
    modify SITE_ID BIGINT auto_increment;


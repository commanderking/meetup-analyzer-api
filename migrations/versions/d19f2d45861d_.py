"""empty message

Revision ID: d19f2d45861d
Revises: d6a1b2256753
Create Date: 2019-06-01 19:02:52.395042

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd19f2d45861d'
down_revision = 'd6a1b2256753'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('event_attendance', 'event_id',
                    existing_type=sa.VARCHAR(),
                    type_=sa.Integer,
                    postgresql_using='event_id::integer',
                    nullable=False)
    op.create_foreign_key(None, 'event_attendance',
                          'events', ['event_id'], ['id'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'event_attendance', type_='foreignkey')
    op.alter_column('event_attendance', 'event_id',
                    existing_type=sa.Integer,
                    type_=sa.VARCHAR(),
                    postgresql_using='event_id::string',
                    nullable=True)
    # ### end Alembic commands ###
